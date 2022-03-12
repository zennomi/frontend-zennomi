import { useState, useCallback, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { chunk } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// @mui
import {
    Container, Grid, Typography, Card, Box, Skeleton,
    Button, CardHeader, CardContent, Avatar, Alert, Stack, Pagination
} from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import TitleCard from '../../components/title/TitleCard';
import CopyClipboard from '../../components/CopyClipboard';
// utils
import axios from '../../utils/axios';
// paths
import { PATH_WIBU } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function List() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const [list, setList] = useState();
    const [page, setPage] = useState(1);

    const listChunks = list ? chunk(list.titles, 24) : [];

    const getList = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/lists/${id}`);
            if (isMountedRef.current) {
                setList(data);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
            navigate(PATH_WIBU.root);
        }
    }, [isMountedRef]);

    const handlePageChange = (event, page) => {
        setPage(page);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        getList();
    }, [getList]);

    return (
        <Page title={list?.name || ""}>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading={list?.name || <Skeleton variant='h3' />}
                    links={[
                        { name: PATH_WIBU.label, href: PATH_WIBU.root },
                        { name: PATH_WIBU.list.label, href: PATH_WIBU.list.root },
                        { name: list?.name || <Skeleton variant='text' />, href: `${PATH_WIBU.list.one}/${id}` },
                    ]}
                />
                <Stack spacing={1}>
                    {
                        user?.id === list?.user.id &&
                        <>
                            <Card>
                                <CardHeader title="User" />
                                <CardContent>
                                    <Button size='small' component={RouterLink} to={`${PATH_WIBU.list.one}/edit/${id}`}>Cập nhật</Button>
                                    <Button color='error' size='small' component={RouterLink} to={`${PATH_WIBU.list.one}/delete/${id}`}>Xoá</Button>
                                </CardContent>
                            </Card>
                        </>
                    }
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar alt={list?.user.displayName} src={list?.user.photoURL} sx={{ mr: 2 }} />
                                <Typography variant='subtitle2'>{parse(list?.user.displayName || '')}</Typography>
                            </Box>
                            <Typography variant='body1'>{parse(list?.description || '')}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ mb: 2 }}>
                        <CardHeader title="Share link" />
                        <CardContent>
                            <CopyClipboard value={window.location.href} disabled />
                        </CardContent>
                    </Card>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {
                            listChunks.length > 0 ?
                                listChunks[page - 1].map(title => (
                                    <Grid item xs={4} md={2} >
                                        <TitleCard title={title} />
                                    </Grid>
                                )) :
                                <Grid item>
                                    <Alert severity="info">Chưa có thêm bộ nào à? Thêm thủ công ở phần cập nhật hoặc thêm ở trang riêng của từng bộ nhé.</Alert>
                                </Grid>
                        }
                    </Grid>
                    <Pagination sx={{ my: 2 }} count={listChunks.length || 1} page={page} onChange={handlePageChange} />
                </Stack>
            </Container>
        </Page >
    );
}
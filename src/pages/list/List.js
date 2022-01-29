import { useState, useCallback, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
// @mui
import {
    Container, Grid, Typography, Card, Box, Skeleton, 
    Button, CardHeader, CardContent, Avatar,
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
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar alt={list?.user.displayName} src={list?.user.photoURL} sx={{ mr: 2 }} />
                            <Typography variant='subtitle2'>{parse(list?.user.displayName || '')}</Typography>
                        </Box>
                        <Typography variant='body1'>{parse(list?.description || '')}</Typography>

                    </CardContent>
                </Card>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {
                        list?.titles.map(title => (
                            <Grid item xs={4} md={3} xl={2}>
                                <TitleCard title={title} />
                            </Grid>
                        ))
                    }
                </Grid>
                {
                    user?.id === list?.user.id &&
                    <Card>
                        <CardHeader title="User" />
                        <CardContent>
                            <Button size='small' component={RouterLink} to={`${PATH_WIBU.list.one}/edit/${id}`}>Cập nhật</Button>
                            <Button color='error' size='small' component={RouterLink} to={`${PATH_WIBU.list.one}/delete/${id}`}>Xoá</Button>
                        </CardContent>
                    </Card>
                }
            </Container>
        </Page >
    );
}
import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';

import { Container, Pagination, Box, Chip, Stack, Paper, Typography, Link, ToggleButton, ToggleButtonGroup } from '@mui/material';
// hooks
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useAuth from '../../hooks/useAuth';

// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
// utils
import axios from '../../utils/axios';
// paths
import { PATH_WIBU } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Lists() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const { user, isAuthenticated } = useAuth();

    const [lists, setLists] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [isMyLists, setIsMyLists] = useState(false);

    const getLists = useCallback(async () => {
        try {
            const params = { populate: 'user', page };
            if (isMyLists) params.user = user.id;
            const { data } = await axios.get('/v1/lists', {
                params
            });
            if (isMountedRef.current) {
                setLists(data.results);
                setTotal(data.totalPages);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, page, isMyLists]);

    const handlePageChange = (event, page) => {
        setPage(page);
    }

    useEffect(() => {
        getLists();
        return () => { setLists([]); }
    }, [getLists]);

    const handleChange = (event, value) => {
        if (!value) return setIsMyLists(false);
        return setIsMyLists(true);
    }

    return (
        <Page title="Bộ sưu tập">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Bộ sưu tập"
                    links={[
                        { name: PATH_WIBU.label, href: PATH_WIBU.root },
                        { name: PATH_WIBU.list.label, href: PATH_WIBU.list.root },
                    ]}
                />
                <Stack spacing={2}>
                    {isAuthenticated &&
                        <ToggleButtonGroup
                            color="primary"
                            value={isMyLists}
                            exclusive
                            onChange={handleChange}
                            fullWidth
                        >
                            <ToggleButton value={false}>Tất cả</ToggleButton>
                            <ToggleButton value={true}>Bộ sưu tập của tôi</ToggleButton>
                        </ToggleButtonGroup>
                    }
                    {
                        lists.map(
                            list =>
                                <Paper key={list._id} sx={{ p: 2 }}>
                                    <Link component={RouterLink} variant='h6' to={`${PATH_WIBU.list.one}/${list._id}`} >
                                        {`${list.name} - ${list.titles.length} bộ`}
                                    </Link>
                                    <Typography variant='body2'>
                                        {`Bởi ${list.user.displayName}`}
                                    </Typography>
                                </Paper>
                        )
                    }
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Pagination sx={{ my: 2 }} count={total} page={page} onChange={handlePageChange} />
                </Box>
            </Container>
        </Page>
    );
}
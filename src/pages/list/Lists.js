import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';

import { Container, Grid, Button, IconButton, Pagination, Box, Chip, Stack, Paper, Typography, Link } from '@mui/material';
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
    const { user } = useAuth();

    const [lists, setLists] = useState([]);
    const [total, setTotal] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams({ page: 1 });

    const getLists = useCallback(async () => {
        try {
            const { data } = await axios.get('/v1/lists', {
                params: { ...paramsToObject(searchParams), limit: 12, populate: 'user' }
            });
            if (isMountedRef.current) {
                setLists(data.results);
                setTotal(data.totalPages);
            }
        } catch (err) {
            console.error(err);
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, searchParams]);

    const handlePageChange = (event, page) => {
        setNewParams({ page });
    }

    const setNewParams = (params) => {
        if (!params.page) params.page = 1;
        const newParams = paramsToObject(searchParams);
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === 'all' || params[key] === '') delete newParams[key];
            else newParams[key] = params[key];
        });
        setSearchParams({
            ...newParams
        })
    }

    useEffect(() => {
        getLists();
        return () => { setLists([]); }
    }, [getLists]);

    const handleTypeClick = (_type) => {
        if (_type === searchParams.get("type")) setNewParams({ type: null, page: 1 });
        else setNewParams({ type: _type, page: 1 });
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
                    {
                        lists.map(
                            list =>
                                <Paper key={list._id} sx={{ p: 2 }}>
                                    <Link component={RouterLink} variant='h6' to={`${PATH_WIBU.list.one}/${list._id}`} >
                                        {list.name}
                                    </Link>
                                    <Typography variant='body2'>
                                        {list.user.displayName}
                                    </Typography>
                                </Paper>
                        )
                    }
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
                </Box>
            </Container>
        </Page>
    );
}

function paramsToObject(urlParams) {
    const entries = urlParams.entries();
    const result = {}
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}
import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import { Button, Card, CardActions, CardContent, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
// utils
import axios from '../../utils/axios';
// sections
import { PATH_WIBU } from '../../routes/paths';
// ---------------------------------------------------------------------

export default function DeleteList() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState();
    const { id } = useParams();

    const getList = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/lists/${id}`);
            if (isMountedRef.current) {
                setList(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    const handleClick = useCallback(async () => {
        try {
            const { data } = await axios.delete(`/v1/lists/${id}`);
            console.log(data);
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
        navigate(`${PATH_WIBU.list.root}`);
    }, [isMountedRef, id]);

    useEffect(() => {
        getList();
    }, [getList]);

    return (
        <Page title="Xoá bộ sưu tập">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Card>
                    <CardContent>
                        {`Xoá bộ sưu tập ${list?.name}?`}
                    </CardContent>
                    <CardActions>
                        <Button color='error' variant='contained' onClick={handleClick}>Xác nhận</Button>
                        <Button color='secondary' component={RouterLink} to={`${PATH_WIBU.list.one}/${id}`}>Huỷ</Button>
                    </CardActions>
                </Card>
            </Container>
        </Page>
    );
}

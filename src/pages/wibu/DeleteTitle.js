import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink,useParams } from 'react-router-dom';
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
import TitleNewFrom from '../../sections/title/TitleNewForm';
import { PATH_WIBU } from '../../routes/paths';
// ---------------------------------------------------------------------

export default function EditTitle() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [title, setTitle] = useState();
    const { id } = useParams();

    const getTitle = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/titles/${id}`);
            if (isMountedRef.current) {
                setTitle(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    const handleClick = useCallback(async () => {
        try {
            const { data } = await axios.delete(`/v1/titles/${id}`);
            console.log(data);
        } catch (err) {
            //
        }
    }, [isMountedRef, id]);

    useEffect(() => {
        getTitle();
    }, [getTitle]);

    return (
        <Page title="Edit Title">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Card>
                    <CardContent>
                        {`Xoá bộ ${title?.title.en}`}
                    </CardContent>
                    <CardActions>
                        <Button color='error' onClick={handleClick}>Xác nhận</Button>
                        <Button color='secondary' component={RouterLink} to={`${PATH_WIBU.title.one}/${id}`}>Huỷ</Button>
                    </CardActions>
                </Card>
            </Container>
        </Page>
    );
}

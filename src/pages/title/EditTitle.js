import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
// utils
import axios from '../../utils/axios';
// sections
import TitleNewFrom from '../../sections/title/TitleNewForm';
// ---------------------------------------------------------------------

export default function EditTitle() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const [title, setTitle] = useState();
    const { id } = useParams();

    const getTitle = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/titles/${id}?cache=false`);
            if (isMountedRef.current) {
                setTitle(data);
            }
        } catch (err) {
            //
        }
    }, [isMountedRef]);

    const titleSubmit = async (title) => {
        return await axios({
            method: 'post',
            url: `/v1/titles/${id}`,
            data: title,
        })
    }

    useEffect(() => {
        getTitle();
    }, [getTitle]);

    return (
        <Page title="Edit Title">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <TitleNewFrom currentTitle={title} titleSubmit={titleSubmit} />
            </Container>
        </Page>
    );
}

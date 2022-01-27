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
import ListNewFrom from '../../sections/list/ListNewForm';
// ---------------------------------------------------------------------

export default function EditList() {
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
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

    useEffect(() => {
        getList();
    }, [getList]);

    return (
        <Page title="Sửa bộ sưu tập">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <ListNewFrom isEdit currentList={list} />
            </Container>
        </Page>
    );
}

import { useState, useCallback, useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { uniq } from 'lodash';
import { useSnackbar } from 'notistack';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import LoadingText from '../../components/LoadingText';
// paths
import { PATH_WIBU } from '../../routes/paths';
// utils
import axios from '../../utils/corsAxios';
import { fSource } from '../../utils/formatSource';
// ----------------------------------------------------------------------

export default function TitleContext() {
    const { source, slug } = useParams();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [title, setTitle] = useState(null);

    const getTitle = useCallback(async () => {
        const url = `https://cubari.moe/read/api/${source}/series/${slug}/`;
        try {
            if (isMountedRef) {
                const { data } = await axios({
                    url: url,
                    method: 'get',
                });
                Object.assign(data, {
                    staff: uniq([data.author, data.artist]).filter(s => Boolean(s)),
                    source,
                    chapterNumbers: Object.keys(data.chapters),
                    groupNumbers: Object.keys(data.groups),
                    path: `${PATH_WIBU.read.root}/${source}/${slug}`,
                    sourceLink: fSource(source, slug)
                })
                setTitle(data);
            }
        } catch (error) {
            enqueueSnackbar("Đã có xảy ra. Khả năng là link không hợp lệ.", { variant: "error" });
            navigate(-1);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTitle();
        return () => setTitle(null);
    }, []);

    return (
        title ?
            <Outlet context={{ title }} /> :
            <LoadingText fullscreen />
    );
}

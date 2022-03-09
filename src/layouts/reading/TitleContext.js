import { useState, useCallback, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import axios from '../../utils/corsAxios';
import { uniq } from 'lodash'
import useIsMountedRef from '../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

export default function TitleContext() {
    const [title, setTitle] = useState(null);

    const { provider, titleId } = useParams();
    const isMountedRef = useIsMountedRef();

    const getTitle = useCallback(async () => {
        const url = `https://cubari.moe/read/api/${provider}/series/${titleId}/`;

        if (isMountedRef) {
            const { data } = await axios({
                url: url,
                method: 'get',
            });
            data.staff = uniq([data.author, data.artist]).filter(s => Boolean(s));
            data.provider = provider;
            setTitle(data);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTitle();
        return () => setTitle(null);
    }, []);

    return (
        title &&
        <Outlet context={{ title }} />
    );
}

import { useCallback, useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
// @mui
import { Box, Container, Stack, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import MangaImage from '../../components/MangaImage';
// assets
import axios from '../../utils/corsAxios';

// ----------------------------------------------------------------------

export default function Chapter({ title }) {
    const { themeStretch } = useSettings();
    const params = useParams();
    const { provider, titleId, chapterNumber } = params;

    const isMangaDex = provider == "mangadex";

    const groupIndexes = Object.keys(title.groups);
    const [groupIndex, setGroupIndex] = useState(groupIndexes.find(index => Boolean(title.chapters[chapterNumber].groups[index])));

    const initPages = (() => {
        if (title.provider === "mangadex") return [];
        if (title.provider === "imgur") return title.chapters[chapterNumber].groups[groupIndex].map(c => c.src);
        return title.chapters[chapterNumber].groups[groupIndex];
    })();


    const [pages, setPages] = useState(initPages);

    const getMangaDexChapter = useCallback(async () => {
        if (!isMangaDex) return;

        const url = `https://cubari.moe${title.chapters[chapterNumber]?.groups[groupIndex]}`;
        const { data } = await axios({
            url: url,
            method: 'get',
        });

        setPages(data);
    }, [isMangaDex, chapterNumber, groupIndex]);

    useEffect(() => {
        getMangaDexChapter();
        return () => setPages([]);
    }, [getMangaDexChapter]);

    return (
        <Page title={`${title.title} | Chương ${chapterNumber} | ${provider}`}>
            <Container maxWidth={themeStretch ? false : 'md'} sx={{ p: 0 }}>
                {
                    title ?
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                {
                                    pages.map(page => (
                                        <MangaImage src={page} referrerPolicy="same-origin" key={page} disabledEffect threshold={1000} />
                                    ))
                                }
                            </Box>
                        </Stack>
                        :
                        <LoadingScreen fullSrceen />
                }
            </Container>
        </Page>
    );
}

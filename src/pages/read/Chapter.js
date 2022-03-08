import { useCallback, useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
// @mui
import { Box, Container, Stack, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import Image from '../../components/Image';
// assets
import ImagePlaceHolder from '../../assets/img_placeholder.svg';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function Chapter() {
    const { themeStretch } = useSettings();
    const params = useParams();
    const { provider, titleId, chapterNumber } = params;

    const isMangaDex = provider == "mangadex";

    const { title } = useOutletContext();

    const groupIndexes = Object.keys(title.groups);
    const [groupIndex, setGroupIndex] = useState(groupIndexes.find(index => Boolean(title.chapters[chapterNumber].groups[index])));

    const [pages, setPages] = useState(isMangaDex ? [] : title.chapters[chapterNumber].groups[groupIndex]);

    const getMangaDexChapter = useCallback(async () => {
        if (!isMangaDex) return;
        const url = `https://cubari.moe${title.chapters[chapterNumber]?.groups[groupIndex]}`;

        const noCorsUrl = `http://localhost:5000/v1/cors/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_")}?source=proxy_cubari_moe`;
        const { data } = await axios({
            url: noCorsUrl,
            method: 'get',
            headers: {
                // 'Referrer-Policy': 'same-origin',
                // 'Access-Control-Allow-Origin': 'localhost',
                // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                // 'x-requested-with': 'cubari',
            }
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
                                        // <LazyLoadImage
                                        //     src={page}
                                        //     referrerPolicy="same-origin"
                                        //     effect="blur"
                                        //     placeholderSrc={ImagePlaceHolder}
                                        // />
                                        <Image src={page} referrerPolicy="same-origin" key={page} />
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

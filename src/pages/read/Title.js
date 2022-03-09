import { useState, useCallback, useEffect, useRef, useContext } from 'react';
import Slider from 'react-slick';
import parse from 'html-react-parser';
import { Link as RouterLink, useParams, useOutletContext } from 'react-router-dom';
// @mui
import { useTheme, } from '@mui/material/styles';
import {
    Container, Grid, Typography, Card, Box, Skeleton, Stack, Divider, Rating,
    Button, CardHeader, CardContent, MenuList, Menu, Alert, Link, Paper
} from '@mui/material';
// hooks
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from '../../components/Image';
import CustomStyle from '../../components/CustomStyle';
import Label from '../../components/Label';
// paths
import { PATH_WIBU } from '../../routes/paths';
import Iconify from '../../components/Iconify';
import ChapterList from '../../components/ChapterList';

// ----------------------------------------------------------------------

function chaptersToArray(title) {
    const { chapters, groups } = title;
    const array = [];
    for (const [chapterNumber, chapter] of Object.entries(chapters)) {
        for (const [groupNumber, pages] of Object.entries(chapter.groups)) {
            array.push({
                volume: Number(chapter.volume),
                chapterNumber: Number(chapterNumber),
                title: chapter.title,
                id: `${chapter.volume}-${chapterNumber}-${groupNumber}`,
                group: groups[groupNumber],
                lastUpdated: chapter.last_updated,
                url: `${PATH_WIBU.read.root}/${title.provider}/${title.slug}/${chapterNumber}?groupNumber=${groupNumber}`
            })
        }
    }
    return array;
}

export default function Title() {
    const theme = useTheme();
    const { themeStretch } = useSettings();
    const { enqueueSnackbar } = useSnackbar();
    const { provider } = useParams();
    const { title } = useOutletContext();

    const chapterRows = chaptersToArray(title, title.groups);

    return (
        <Page title={title?.series_name || ""}>
            <Container maxWidth={themeStretch ? false : 'md'} sx={{ my: 2 }}>
                <HeaderBreadcrumbs
                    heading={title?.series_name || <Skeleton variant='h3' />}
                    links={[
                        { name: PATH_WIBU.label, href: PATH_WIBU.root },
                        { name: "Đọc truyện", href: PATH_WIBU.read.root },
                        { name: provider, href: PATH_WIBU.read.root },
                        { name: title?.series_name, href: `${PATH_WIBU.read.root}/${title?.slug}` },
                    ]}
                />
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={12} md={3}>
                            {
                                title?.cover &&
                                <Image src={title.cover} referrerPolicy="same-origin" />
                            }
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Stack direction='row' spacing={0.5}>
                                <Label color='error' variant='filled'>MANGA</Label>
                            </Stack>
                            <Typography variant='h3'>
                                {title?.series_name?.toUpperCase() || <Skeleton />}{"  "}
                            </Typography>
                            <Typography variant='body2' sx={{ opacity: 0.72 }}>
                                {title?.title?.toUpperCase()}
                            </Typography>
                            {
                                title && title.staff.map(a => <Label sx={{ m: 0.5 }} variant='filled'>{a}</Label>)
                            }
                            {
                                title?.description &&
                                <CustomStyle>
                                    <Typography variant='body1'>
                                        {parse(title.description)}
                                    </Typography>
                                </CustomStyle>
                            }
                            <Divider sx={{ my: 2 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <ChapterList rows={chapterRows} />
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Page >
    );
}
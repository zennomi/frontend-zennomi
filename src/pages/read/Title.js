import parse from 'html-react-parser';
import { useParams, useOutletContext, Link as RouterLink } from 'react-router-dom';
// @mui
import {
    Container, Grid, Typography, Skeleton, Stack, Divider, Paper, Button, Box
} from '@mui/material';
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
                title: chapter.title || `Tập ${chapter.volume} - Chương ${chapterNumber}`,
                id: `${chapter.volume}-${chapterNumber}-${groupNumber}`,
                group: groups[groupNumber],
                lastUpdated: chapter.last_updated,
                url: `${PATH_WIBU.read.root}/${title.source}/${title.slug}/${chapterNumber}?groupNumber=${groupNumber}`
            })
        }
    }
    return array;
}

export default function Title() {
    const { source, slug } = useParams();

    const { title } = useOutletContext();

    const chapterRows = chaptersToArray(title, title.groups);

    return (
        <Page title={title.series_name || ""}>
            <Container maxWidth='md' sx={{ my: 2 }}>
                <HeaderBreadcrumbs
                    heading={title.series_name || <Skeleton variant='h3' />}
                    links={[
                        { name: PATH_WIBU.label, href: PATH_WIBU.root },
                        { name: "Đọc", href: PATH_WIBU.read.root },
                        { name: source, href: PATH_WIBU.read.root },
                        { name: title.series_name, href: `${PATH_WIBU.read.root}/${slug}` },
                    ]}
                />
                <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={12} md={3}>
                            {
                                title.cover &&
                                // <Image src={title.cover} referrerPolicy="same-origin" />
                                <Image src={title.cover} />
                            }
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Stack direction='row' spacing={0.5}>
                                <Label color='error' variant='filled'>MANGA</Label>
                            </Stack>
                            <Typography variant='h3'>
                                {title.series_name?.toUpperCase() || <Skeleton />}{"  "}
                            </Typography>
                            <Typography variant='body2' sx={{ opacity: 0.72 }}>
                                {title.title?.toUpperCase()}
                            </Typography>
                            {
                                title.staff.map(a => <Label sx={{ m: 0.5 }} variant='filled' key={a}>{a}</Label>)
                            }
                            {
                                title.description &&
                                <CustomStyle>
                                    <Typography variant='body1'>
                                        {parse(title.description)}
                                    </Typography>
                                </CustomStyle>
                            }
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    component="a"
                                    href={title.sourceLink}
                                    target="_blank"
                                    color="error"
                                    sx={{ m: 0.5 }}
                                >
                                    {source}
                                </Button>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to={`${title.path}/${title.chapterNumbers[0]}`}
                                    sx={{ m: 0.5 }}
                                >
                                    Đọc chương đầu
                                </Button>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to={`${title.path}/${title.chapterNumbers[title.chapterNumbers.length - 1]}`}
                                    sx={{ m: 0.5 }}
                                >
                                    Đọc chương mới nhất
                                </Button>
                            </Box>
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
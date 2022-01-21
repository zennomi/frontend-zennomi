import { useState, useCallback, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
    Container, Grid, Typography, Card,
    Link, Box, Skeleton, Stack, Divider, Rating,
    Button, CardHeader, CardContent, Avatar
} from '@mui/material';
// hooks
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from '../../components/Image';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import { CarouselDots, CarouselArrows } from '../../components/carousel';
import ZennomiScore from '../../sections/title/ZennomiScore';
// utils
import axios from '../../utils/axios';
// paths
import { PATH_WIBU } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Title() {
    const theme = useTheme();
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const settings = {
        speed: 800,
        dots: true,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current, next) => setCurrentIndex(next),
        ...CarouselDots({
            zIndex: 9,
            top: 24,
            left: 24,
            position: 'absolute',
        }),
    };

    const { id } = useParams();

    const [title, setTitle] = useState();

    const getTitle = useCallback(async () => {
        try {
            const { data } = await axios.get(`/v1/titles/${id}`);
            if (isMountedRef.current) {
                setTitle(data);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
            navigate(PATH_WIBU.root);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTitle();
    }, [getTitle]);

    const handlePrevious = () => {
        carouselRef.current.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
    };

    return (
        <Page title={title?.title.en || ""}>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading={title?.name || <Skeleton variant='h3' />}
                    links={[
                        { name: PATH_WIBU.label, href: PATH_WIBU.root },
                        { name: PATH_WIBU.title.label, href: PATH_WIBU.title.root },
                        { name: title?.name || <Skeleton variant='text' />, href: `${PATH_WIBU.title.one}/${id}` },
                    ]}
                />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <CardSlider sx={{ mx: 'auto' }}>
                            <Slider ref={carouselRef} {...settings}>
                                {title?.coverArt.map((cover, index) => (
                                    <CarouselItem key={index} coverArt={cover} isActive={index === currentIndex} />
                                ))
                                }
                            </Slider>
                            <CarouselArrows
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                spacing={0}
                                sx={{
                                    top: 16,
                                    right: 16,
                                    position: 'absolute',
                                    '& .arrow': {
                                        p: 0,
                                        width: 32,
                                        height: 32,
                                        opacity: 0.48,
                                        color: 'common.white',
                                        '&:hover': { color: 'common.white', opacity: 1 },
                                    },
                                }}
                            />
                        </CardSlider>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Stack direction='row' spacing={0.5}>
                            <Label color='error' variant='filled'>{title?.type.toUpperCase()}</Label>
                            <StatusLabel status={title?.status} />
                        </Stack>
                        <Typography variant='h3'>
                            {title?.title.en?.toUpperCase() || <Skeleton />}{"  "}
                            {title?.score && <Rating value={title.score / 100 * 5} precision={0.5} readOnly />}
                        </Typography>
                        <Typography variant='body2' sx={{ opacity: 0.72 }}>
                            {title?.title.ja?.toUpperCase()}
                        </Typography>
                        <Typography variant='body2' sx={{ opacity: 0.72 }}>
                            {title?.title.vi?.toUpperCase()}
                        </Typography>
                        {
                            title && [...title.author, ...title.artist].map(a => <Label sx={{ m: 0.5 }} variant='filled'>{a}</Label>)
                        }
                        {
                            title?.description &&
                            <Typography variant='body1'>
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {title.description}
                                </ReactMarkdown>
                            </Typography>
                        }
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {title?.genres.map(genre => <Label color='primary' sx={{ m: 0.2 }}>{genre}</Label>)}
                            {title?.tags.map(genre => <Label color='primary' variant='outlined' sx={{ m: 0.2 }}>{genre}</Label>)}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Liên kết" />
                            <CardContent>
                                <Stack spacing={1}>
                                    {
                                        title?.links?.vi?.length > 0 &&
                                        <div><Typography variant='h6'>Link tiếng Việt</Typography>
                                            {title?.links?.vi.map(url =>
                                                <Button startIcon={<LinkIcon site={url.site} />} size='large' target="_blank" component='a' href={url.link}>{url.site.toUpperCase()}</Button>
                                            )}
                                        </div>
                                    }
                                    {
                                        title?.links?.en?.length > 0 &&
                                        <div><Typography variant='h6'>Link tiếng Anh</Typography>
                                            {title?.links?.en.map(url =>
                                                <Button startIcon={<LinkIcon site={url.site} />} size='large' target="_blank" component='a' href={url.link}>{url.site.toUpperCase()}</Button>
                                            )}
                                        </div>
                                    }
                                    {
                                        title?.links?.raw?.length > 0 &&
                                        <div><Typography variant='h6'>Link raw</Typography>
                                            {title?.links?.raw.map(url =>
                                                <Button startIcon={<LinkIcon site={url.site} />} size='large' target="_blank" component='a' href={url.link}>{url.site.toUpperCase()}</Button>
                                            )}
                                        </div>
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ZennomiScore score={title?.score} zennomi={title?.zennomi} />
                    </Grid>
                </Grid>
                <Card>
                    <CardHeader title="Admin" />
                    <CardContent>
                        <Button size='large' component={RouterLink} to={`${PATH_WIBU.title.one}/edit/${id}`}>Cập nhật</Button>
                        <Button color='error' size='large' component={RouterLink} to={`${PATH_WIBU.title.one}/delete/${id}`}>Xoá</Button>
                    </CardContent>
                </Card>
            </Container>
        </Page >
    );
}

function CarouselItem({ coverArt, isActive }) {
    return (
        <Box sx={{ position: 'relative' }}>
            <Image src={coverArt} ratio="4/6" />
        </Box>
    );
}

function StatusLabel({ status = 'ongoing' }) {
    let color;
    if (status === 'ongoing') color = 'info';
    else if (status === 'completed') color = 'success';
    else if (status === 'hiatus') color = 'warning';
    else color = 'error';
    return (<Label color={color} variant='filled'>{status.toUpperCase()}</Label>)
}

function LinkIcon({ site, language }) {
    if (site === 'blogtruyen.vn') return <Avatar src='/icons/ic_blogtruyen.png' sx={{ borderRadius: 1 }} />
    else if (site === 'mangadex.org') return <Avatar src='/icons/ic_mangadex.svg' sx={{ borderRadius: 1 }} />
    else if (site === 'hako.re') return <Avatar src='/icons/ic_hako.png' sx={{ borderRadius: 1 }} />
    else if (site === 'facebook.com') return <Iconify icon='logos:facebook' />
    else if (site === 'google') return <Iconify icon={'flat-color-icons:google'} />
    else return <Iconify icon='fa-solid:link' />
}

const CardSlider = styled(Card)(({ theme }) => {
    return {
        [theme.breakpoints.down('md')]: {
            width: '70%',
        },
    }
})
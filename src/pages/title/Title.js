import { useState, useCallback, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import parse from 'html-react-parser';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
    Container, Grid, Typography, Card, Box, Skeleton, Stack, Divider, Rating,
    Button, CardHeader, CardContent, MenuList, Menu, MenuItem,
} from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from '../../components/Image';
import Label from '../../components/Label';
import { CarouselDots, CarouselArrows } from '../../components/carousel';
import ZennomiScore from '../../sections/title/ZennomiScore';
import TitleLinks from '../../sections/title/TitleLinks';
import ListSelect from '../../sections/title/ListSelect';
// utils
import axios from '../../utils/axios';
// paths
import { PATH_WIBU } from '../../routes/paths';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function Title() {
    const theme = useTheme();
    const { themeStretch } = useSettings();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [title, setTitle] = useState();
    const [userLists, setUserLists] = useState([]);

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

    const getLists = useCallback(async () => {
        if (!user.id) return;
        try {
            const { data } = await axios.get(`/v1/lists?user=${user.id}`);
            if (isMountedRef.current) {
                setUserLists(data.results);
            }
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }, [isMountedRef, user]);

    const handleListsSubmit = async (data) => {
        console.log(data);
        try {
            await axios({
                url: `/v1/lists/title/${id}`,
                method: 'post',
                data: data.lists.map(list => list.id)
            });
            await getLists();
            enqueueSnackbar('Sửa bộ sưu tập thành công.');
            handleClose();
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }

    useEffect(() => {
        getTitle();
    }, [getTitle]);

    useEffect(() => {
        getLists();
    }, [getLists]);

    const handlePrevious = () => {
        carouselRef.current.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Page title={title?.name || ""}>
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading={title?.name || <Skeleton variant='h3' />}
                    links={[
                        { name: PATH_WIBU.label, href: PATH_WIBU.root },
                        { name: PATH_WIBU.title.label, href: PATH_WIBU.title.root },
                        { name: title?.name || <Skeleton variant='text' />, href: `${PATH_WIBU.title.one}/${id}` },
                    ]}
                />
                <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={12} md={3}>
                        <CardSlider sx={{ mx: 'auto', mb: 2 }}>
                            <Slider ref={carouselRef} {...settings}>
                                {title?.coverArt ?
                                    title.coverArt.map((cover, index) => (
                                        <CarouselItem key={index} coverArt={cover} isActive={index === currentIndex} />
                                    )) :
                                    <CarouselItem coverArt={null} isActive={true} />
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
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            size='large'
                            fullWidth
                            color='warning'
                            variant='contained'
                            startIcon={<Iconify icon='ant-design:profile-twotone' />}
                            onClick={handleClick}
                        >Thêm vào bộ sưu tập
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuList>
                                <ListSelect
                                    userLists={userLists}
                                    titleId={id}
                                    handleClose={handleClose}
                                    onSubmit={handleListsSubmit}
                                />
                            </MenuList>
                        </Menu>
                    </Grid>
                    <Grid item xs={12} md={9}>
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
                                {parse(title.description)}
                            </Typography>
                        }
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {title?.genres.map(genre => <Label key={genre} color='primary' sx={{ m: 0.2 }}>{genre}</Label>)}
                            {title?.tags.map(tag => <Label key={tag} color='primary' variant='outlined' sx={{ m: 0.2 }}>{tag}</Label>)}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TitleLinks links={title?.links} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ZennomiScore score={title?.score} zennomi={title?.zennomi} />
                    </Grid>
                </Grid>
                {
                    user.isStaff &&
                    <Card>
                        <CardHeader title="Admin" />
                        <CardContent>
                            <Button size='small' component={RouterLink} to={`${PATH_WIBU.title.one}/edit/${id}`}>Cập nhật</Button>
                            <Button color='error' size='small' component={RouterLink} to={`${PATH_WIBU.title.one}/delete/${id}`}>Xoá</Button>
                        </CardContent>
                    </Card>
                }

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

const CardSlider = styled(Card)(({ theme }) => {
    return {
        [theme.breakpoints.down('md')]: {
            width: '70%',
        },
    }
})
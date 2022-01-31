import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { m } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { CardContent, Box, Card, Typography, Link } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionContainer, varFade } from '../../components/animate';
import { CarouselDots, CarouselArrows } from '../../components/carousel';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------
const _appFeatured = [
    {
        image: 'https://uploads.mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/5972847b-e0a4-4346-8dd6-8f06839ee1a7.jpg', 
        title: 'Thư viện Rom-Com', 
        description: 'Tất cả các bộ Rom-Com mà tôi đã/đang đọc/xem'
    },
    {
        image: 'https://uploads.mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/46c57a93-32d0-4fd0-9cc8-39f0a29ff18b.jpg', 
        title: 'Tra cứu nguồn đọc/xem', 
        description: 'Link cập nhật thường xuyên'
    },
    {
        image: 'https://uploads.mangadex.org/covers/aa6c76f7-5f5f-46b6-a800-911145f81b9b/e9e0082e-26a9-4526-941a-6f0f02e6d2ed.jpg', 
        title: 'Tạo bộ sưu tập', 
        description: 'Xếp hạng & chia sẻ'
    },
]
export default function AppFeatured() {
  const theme = useTheme();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? _appFeatured.length - 1 : 0);

  const settings = {
    speed: 2000,
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

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  return (
    <Card>
      <Slider ref={carouselRef} {...settings}>
        {_appFeatured.map((app, index) => (
          <CarouselItem key={app.title} item={app} isActive={index === currentIndex} />
        ))}
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
    </Card>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  isActive: PropTypes.bool,
  item: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
  }),
};

function CarouselItem({ item, isActive }) {
  const { image, title, description } = item;

  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        component={MotionContainer}
        animate={isActive}
        action
        sx={{
          bottom: 0,
          width: 1,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography variant="overline" component="div" sx={{ mb: 1, opacity: 0.48 }}>
            Tính năng web
          </Typography>
        </m.div>
        <m.div variants={varFade().inRight}>
          <Link component={RouterLink} to="#" color="inherit" underline="none">
            <Typography variant="h5" gutterBottom noWrap>
              {title}
            </Typography>
          </Link>
        </m.div>
        <m.div variants={varFade().inRight}>
          <Typography variant="body2" noWrap>
            {description}
          </Typography>
        </m.div>
      </CardContent>
      <OverlayStyle />
      <Image alt={title} src={image} sx={{ height: { xs: 500, md: 320 } }} />
    </Box>
  );
}

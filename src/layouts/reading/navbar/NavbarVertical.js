import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer, Typography, Button, IconButton } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import Logo from '../../../components/Logo';
import Scrollbar from '../../../components/Scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
import Iconify from '../../../components/Iconify';
//
import navConfig from './NavConfig';
import NavbarDocs from './NavbarDocs';
import CollapseButton from './CollapseButton';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

const CollapsedButton = ({ isCollapse, text, icon, ...props }) => {
  if (isCollapse) return <IconButton variant="outlined" sx={{ m: 0.5, minWidth: 0 }}  {...props}><Iconify icon={icon} /></IconButton>
  return <Button variant="outlined" startIcon={<Iconify icon={icon} />} sx={{ m: 0.5, minWidth: 0 }}  {...props}>{text}</Button>
}

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar, title, onToggleSidebar }) {
  const theme = useTheme();

  const { pathname } = useLocation();
  const { provider, titleId, chapterNumber } = useParams();

  let chapterNumberArr, currentChapterIndex;
  if (title) {
    chapterNumberArr = Object.keys(title.chapters);
    currentChapterIndex = chapterNumberArr.findIndex(key => key === chapterNumber);
  }
  const isDesktop = useResponsive('up', 'lg');

  const { isCollapse, collapseClick, onToggleCollapse } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack direction={isCollapse ? "column" : "row"} alignItems="center" justifyContent="space-between">
          <Logo />
          <CollapseButton onToggleCollapse={isDesktop ? onToggleCollapse : onCloseSidebar} collapseClick={collapseClick} />
        </Stack>
      </Stack>
      {
        !isCollapse &&
        <Typography variant="h6" component="h1" align="center">
          {title?.series_name || "Tên chương"}
        </Typography>
      }
      {
        !isCollapse && title &&
        <Typography variant='body2' sx={{ opacity: 0.72 }} align="center">
          {title.author === title.artist ? title.author : `${title.author} & ${title.artist}`}
        </Typography>
      }
      {
        title &&
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
          <CollapsedButton isCollapse={isCollapse} color="error" icon="icomoon-free:evil2" text={provider} />
          <CollapsedButton isCollapse={isCollapse} color="primary" icon="eva:save-fill" text="Tải về" />
          <CollapsedButton isCollapse={isCollapse} color="primary" icon="eva:copy-fill" text="Copy Link" />
          {
            currentChapterIndex > 0 &&
            <CollapsedButton isCollapse={isCollapse} color="primary" icon="eva:arrow-left-fill" text="Chương trước" component={Link} to={`/wibu/read/${provider}/${titleId}/${chapterNumberArr[currentChapterIndex - 1]}`} />
          }
          {
            currentChapterIndex < chapterNumberArr.length - 1 &&
            <CollapsedButton isCollapse={isCollapse} color="primary" icon="eva:arrow-right-fill" text="Chương sau" component={Link} to={`/wibu/read/${provider}/${titleId}/${chapterNumberArr[currentChapterIndex + 1]}`} />
          }
        </Box>
      }

      <Box sx={{ flexGrow: 1 }} />

      {!isCollapse && <NavbarDocs />}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              ...cssStyles(theme).bgBlur(),
              boxShadow: (theme) => theme.customShadows.z24,
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
      {isDesktop &&
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      }
    </RootStyle>
  );
}

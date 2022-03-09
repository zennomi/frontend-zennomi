import { useState, } from 'react';
import { useOutletContext } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { NAVBAR } from '../../config';
//
// import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import OpenSidebarButton from './OpenSidebarButton';
import Chapter from '../../pages/read/Chapter';

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
    shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
    flexGrow: 1,
    [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
        transition: theme.transitions.create('margin-left', {
            duration: theme.transitions.duration.shorter,
        }),
        ...(collapseClick && {
            marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
        }),
    },
}));

// ----------------------------------------------------------------------

export default function ChapterLayout() {
    const { collapseClick } = useCollapseDrawer();

    const { themeLayout } = useSettings();

    const isDesktop = useResponsive('up', 'lg');

    const [open, setOpen] = useState(false);

    const verticalLayout = themeLayout === 'vertical';

    const { title } = useOutletContext();

    return (
        <Box
            sx={{
                display: { lg: 'flex' },
                minHeight: { lg: 1 },
            }}
        >
            {
                !isDesktop && !open &&
                <OpenSidebarButton onClick={() => setOpen(true)} />
            }
            <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} title={title} />
            <MainStyle collapseClick={collapseClick}>
                <Chapter title={title} />
            </MainStyle>
        </Box>
    );
}

import { useState, useCallback, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import axios from 'axios';

// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// config
import { HEADER, NAVBAR } from '../../config';
//
// import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import OpenSidebarButton from './OpenSidebarButton';

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
    const { collapseClick, isCollapse } = useCollapseDrawer();

    const { themeLayout } = useSettings();

    const isDesktop = useResponsive('up', 'lg');

    const [open, setOpen] = useState(false);

    const verticalLayout = themeLayout === 'vertical';

    const [title, setTitle] = useState(null);

    const { provider, titleId } = useParams();
    const isMountedRef = useIsMountedRef();

    const getTitle = useCallback(async () => {
        const url = `https://cubari.moe/read/api/${provider}/series/${titleId}/`;
        const noCorsUrl = `https://services.f-ck.me/v1/cors/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_")}?source=proxy_cubari_moe`;

        if (isMountedRef) {
            const { data } = await axios({
                url: noCorsUrl,
                method: 'get',
                headers: {
                    'Referrer-Policy': 'same-origin',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                }
            });
            setTitle(data);
        }
    }, [isMountedRef]);

    useEffect(() => {
        getTitle();
        return () => setTitle(null);
    }, []);

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
            {
                title &&
                <MainStyle collapseClick={collapseClick}>
                    <Outlet context={{ title }} />
                </MainStyle>
            }
        </Box>
    );
}

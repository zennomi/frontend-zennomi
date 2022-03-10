import { useState, useCallback, useEffect } from 'react';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';

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
// import 
import axios from '../../utils/corsAxios';

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
    const { chapterNumber } = useParams();

    const { title } = useOutletContext();
    const { chapterNumbers, groupNumbers } = title;

    const isDesktop = useResponsive('up', 'lg');

    const [open, setOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams({ groupNumber: groupNumbers.find(num => Boolean(title.chapters[chapterNumber]?.groups[num])) })

    const initPages = (() => {
        if (title.source === "mangadex") return [];
        if (title.source === "imgur") return title.chapters[chapterNumber]?.groups[searchParams.get("groupNumber")].map(c => c.src) || [];
        return title.chapters[chapterNumber]?.groups[searchParams.get("groupNumber")] || [];
    })();

    const [pages, setPages] = useState(initPages);

    const chapter = {
        pages,
        currentIndex: chapterNumbers.findIndex(key => key === chapterNumber),
        number: chapterNumber,
    }

    const getMangaDexChapter = useCallback(async () => {
        if (title.source !== "mangadex") return;
        const url = `https://cubari.moe${title.chapters[chapterNumber]?.groups[searchParams.get("groupNumber")]}`;

        const { data } = await axios({
            url: url,
            method: 'get',
        });
        setPages(data);
    }, [title, chapterNumber, searchParams.get("groupNumber")]);

    useEffect(() => {
        getMangaDexChapter();
        return () => setPages([]);
    }, [getMangaDexChapter]);

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
            <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} title={title} chapter={chapter} />
            <MainStyle collapseClick={collapseClick}>
                <Chapter title={title} chapter={chapter} />
            </MainStyle>
        </Box>
    );
}
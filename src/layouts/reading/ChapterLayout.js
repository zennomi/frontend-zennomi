import { useState, useCallback, useEffect } from 'react';
import { useOutletContext, useParams, useSearchParams } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { NAVBAR } from '../../config';
//
// import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import OpenSidebarButton from './OpenSidebarButton';
import Chapter from '../../pages/read/Chapter';
// import 
import axios from 'src/utils/axios';
import corsAxios from '../../utils/corsAxios';

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
    const currentChapter = title.chapters[chapterNumber];
    const { chapterNumbers, groupNumbers } = title;

    const isDesktop = useResponsive('up', 'lg');

    const [open, setOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams({ groupNumber: groupNumbers.find(num => Boolean(currentChapter.groups[num])) })

    const initPages = (() => {
        if (["mangadex", "mangadex-vi", "blogtruyen"].includes(title.source)) return [];
        if (title.source === "imgur") return currentChapter?.groups[searchParams.get("groupNumber")].map(c => c.src) || [];
        return currentChapter?.groups[searchParams.get("groupNumber")] || [];
    })();

    const [pages, setPages] = useState(initPages);

    const chapter = {
        pages,
        currentIndex: chapterNumbers.findIndex(key => key === chapterNumber),
        number: chapterNumber,
        title: currentChapter.title || `${currentChapter.volume} - ${chapterNumber}`
    }

    const getMangaDexChapter = useCallback(async () => {
        if (title.source === "mangadex" && title.source === "mangadex-vi") {
            const url = `https://cubari.moe${currentChapter.groups[searchParams.get("groupNumber")]}`;

            const { data } = await corsAxios({
                url: url,
                method: 'get',
            });
            setPages(data);
        }

        if (title.source === "blogtruyen") {
            const { data } = await axios({
                url: `/v1/titles/blogtruyen/chapter/${currentChapter.groups[1]}`,
                method: 'get'
            })
            setPages(data.map(url => `https://kyotomanga.live/api/proxy?url=https://m.blogtruyen.vn/&src=${url}`));
        }

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
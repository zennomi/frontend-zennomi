import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IMAGE_PROXY_URL } from '../../../config';
import JSZip from "jszip";
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer, Typography, Button, IconButton, Link, Slider } from '@mui/material';
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
import Iconify from '../../../components/Iconify';
//
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

async function shouldUseProxy(testUrl) {
  // We don't know the actual error so we'll play it
  // safe and assume this error is due to CORS
  try {
    await fetch(testUrl);
    return false;
  } catch (err) {
    return true;
  }
}

async function downloadHandler(url) {
  const TRIES = 3;
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    try {
      return (await fetch(url)).blob();
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error(`Failed to download after exhausting all ${TRIES} tries.`);
}

function initiateDownload(url, filename) {
  let elem = window.document.createElement('a');
  elem.href = url;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function valuetext(value) { return value; }

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar, title, chapter }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  const [downloadProcess, setDownloadProcess] = useState(null);
  const marks = [
    {
      value: 0,
      label: 0
    },
    {
      value: downloadProcess,
      label: downloadProcess,
    },
    {
      value: chapter.pages.length,
      label: chapter.pages.length
    },
  ];

  const { chapterNumbers, groupNumbers } = title;
  const { currentIndex } = chapter;

  const { isCollapse, collapseClick, onToggleCollapse } =
    useCollapseDrawer();

  const handleDownloadButton = async () => {
    setDownloadProcess(0);
    const mimeMap = {
      'image/gif': '.gif',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    }
    let chapURLArray = chapter.pages;
    if (await shouldUseProxy(chapURLArray[0])) {
      // Base64 URL encode the URLs
      chapURLArray = chapURLArray.map((url) => `${IMAGE_PROXY_URL}/v1/image/${btoa(url).replace(/\+/g, "-").replace(/\//g, "_")}?source=reader_download`);
    }
    try {
      let parallelDownloads = 5; //Number of parallel image downloads
      let zip = new JSZip();
      for (let i = 0; i < chapURLArray.length; i += parallelDownloads) {
        let imageBlobs = await Promise.all(
          chapURLArray
            .slice(i, i + parallelDownloads)
            .map((url, subIndex) => {
              return (async () => {
                let contents = await downloadHandler(url);
                setDownloadProcess(process => process + 1);
                return {
                  contents,
                  "fileIndex": String(i + subIndex + 1).padStart(String(chapURLArray.length).length, "0"),
                };
              })();
            })
        );

        imageBlobs.forEach((data) => {
          zip.file(data.fileIndex + mimeMap[data.contents.type], data.contents, { binary: true });
        });
      }
      let zipBlob = await zip.generateAsync({ type: "blob" });
      initiateDownload(URL.createObjectURL(zipBlob), `zennomi_${title.source === "nhentai" ? "suc_cu_it_thoi_" : ""}${title.series_name.replace(/\W/g, "_")}.zip`);
    } catch (err) {
      console.log(err);
    } finally {
      // 
    }
  }

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
        <Typography variant="h6" align="center">
          <Link component={RouterLink} to={title.path}>
            {title.series_name}
          </Link>
        </Typography>
      }
      {
        typeof (downloadProcess) === 'number' &&
        <Box sx={{ p: 2, minHeight: isCollapse ? 100 : "auto" }}>
          {
            !isCollapse &&
            <Typography variant="body2" align="center">Tiến độ</Typography>
          }
          <Slider
            aria-label="Custom marks"
            defaultValue={0}
            orientation={isCollapse ? "vertical" : "horizontal"}
            value={downloadProcess}
            getAriaValueText={valuetext}
            step={1}
            max={chapter.pages.length}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Box>
      }
      {
        !isCollapse &&
        <Typography variant='body2' sx={{ opacity: 0.72 }} align="center">
          {title.author === title.artist ? title.author : `${title.author} & ${title.artist}`}
        </Typography>
      }
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        <CollapsedButton
          component="a"
          href={title.sourceLink}
          target="_blank"
          isCollapse={isCollapse}
          color="error"
          icon="icomoon-free:evil2"
          text={title.source}
        />
        <CollapsedButton
          isCollapse={isCollapse}
          color="primary"
          icon="eva:save-fill"
          text="Tải về"
          onClick={handleDownloadButton}
        />
        <CopyToClipboard text={`${window.origin}${title.path}/${chapter.number}`}>
          <CollapsedButton isCollapse={isCollapse} color="primary" icon="eva:copy-fill" text="Copy Link" />
        </CopyToClipboard>
        {
          currentIndex > 0 &&
          <CollapsedButton
            isCollapse={isCollapse}
            color="primary"
            icon="eva:arrow-left-fill"
            text="Chương trước"
            component={RouterLink}
            to={`${title.path}/${chapterNumbers[currentIndex - 1]}`}
            fullWidth
          />
        }
        {
          currentIndex < chapterNumbers.length - 1 &&
          <CollapsedButton
            isCollapse={isCollapse}
            color="primary"
            icon="eva:arrow-right-fill"
            text="Chương sau"
            component={RouterLink}
            to={`${title.path}/${chapterNumbers[currentIndex + 1]}`}
            fullWidth
          />
        }
      </Box>
      {/* <Box sx={{ p: 2, minHeight: isCollapse ? 300 : "auto" }}>
        {
          !isCollapse &&
          <Typography variant="body2" align="center">Độ rộng trang</Typography>
        }
        <Slider
          aria-label="Page Width"
          defaultValue={}
          orientation={isCollapse ? "vertical" : "horizontal"}
          value={downloadProcess}
          step={1}
          max={chapter.pages.length}
          valueLabelDisplay="auto"
        />
      </Box> */}
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

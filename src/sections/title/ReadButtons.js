import { Link } from 'react-router-dom';
// @mui
import { Button, Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// utils
import { fSlug } from '../../utils/formatSource';
import { sourceToIcon, sourceToColor } from '../../utils/sourceMapping';
// paths
import { PATH_WIBU } from '../../routes/paths';

const lanCodeToFullText = {
    vi: "việt",
    en: "anh",
    ja: "nhật",
    zh: "trung",
    ko: "hàn"
}

function ReadButton({ link }) {
    return (
        <Button
            variant='outlined'
            component={Link}
            to={`${PATH_WIBU.read.root}/${link.source}/${link.slug}`}
            color="inherit"
            sx={{
                color: sourceToColor[link.source],
                borderColor: sourceToColor[link.source],
                '&:hover': {
                    borderColor: sourceToColor[link.source],
                    bgcolor: alpha(sourceToColor[link.source], 0.08),
                },
                m: 0.5
            }}
            size="large"
            startIcon={<img src={sourceToIcon[link.source]} width={24} height={24} />}
        >
            {`Đọc bản ${lanCodeToFullText[link.language] || "raw"}`}
        </Button>
    )
}

export default function ReadButtons({ links = [] }) {
    const readLinks = [];
    links.forEach(link => {
        const path = fSlug(link.link);
        if (path) {
            const [_, source, slug] = path.split("/");

            if (source === 'mangadex' && link.language === 'vi') {
                readLinks.push({ source: 'mangadex-vi', slug, language: link.language });
            } else {
                readLinks.push({ source, slug, language: link.language });
            }
        }
    })
    return (
        readLinks.length > 0 ?
            <>
                <Typography variant="h6">Đọc trực tiếp trên ZenWebApp</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                        readLinks.map(link => <ReadButton link={link} />)
                    }
                </Box>
            </>
            : <></>
    )
}
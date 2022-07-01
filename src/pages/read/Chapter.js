import { useParams, Link } from 'react-router-dom';
// @mui
import { Box, Button } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import MangaImage from '../../components/MangaImage';
// assets

// ----------------------------------------------------------------------

export default function Chapter({ title, chapter }) {
    const { pageWidth } = useSettings();
    const params = useParams();
    const { source, chapterNumber } = params;
    const { currentIndex } = chapter;

    return (
        <Page title={`${title.title} | Chương ${chapterNumber} | ${source}`}>
            <Box >
                {
                    currentIndex > 0 &&
                    <Button
                        size="large"
                        variant="contained"
                        icon="eva:arrow-left-fill"
                        component={Link}
                        fullWidth
                        to={`${title.path}/${title.chapterNumbers[currentIndex - 1]}`}
                        sx={{ borderRadius: 0 }}
                    >
                        Chương trước

                    </Button>
                }
                {
                    chapter.pages.length > 0 ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: `${pageWidth}%`, mx: 'auto' }}>
                            {
                                chapter.pages.map(page => (
                                    <MangaImage src={page} referrerPolicy="same-origin" key={page} threshold={1000} />
                                ))
                            }
                        </Box>
                        :
                        <LoadingScreen />
                }
                {
                    currentIndex < title.chapterNumbers.length - 1 &&
                    <Button
                        size="large"
                        variant="contained"
                        component={Link}
                        to={`${title.path}/${title.chapterNumbers[currentIndex + 1]}`}
                        fullWidth
                        sx={{ borderRadius: 0 }}
                    >
                        Chương tiếp theo
                    </Button>
                }
            </Box>
        </Page>
    );
}

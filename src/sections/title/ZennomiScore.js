// @mui
import { styled, alpha } from '@mui/material/styles';
import { Card, Stack, Typography, Button, OutlinedInput, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
// components
import Image from '../../components/Image';

// ----------------------------------------------------------------------

const ContentStyle = styled(Card)(({ theme }) => ({
  // marginTop: -120,
  boxShadow: 'none',
  padding: theme.spacing(5),
  // paddingTop: theme.spacing(16),
  height: "100%",
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`,
}));

// ----------------------------------------------------------------------

export default function ZennomiScore({ score = 0, zennomi }) {
  return (
    <Paper sx={{height:"100%"}}>
      {/* <Image
        visibleByDefault
        disabledEffect
        src="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_invite.png"
        sx={{
          left: 40,
          zIndex: 9,
          width: 140,
          position: 'relative',
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
        }}
      /> */}
      <ContentStyle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">
            Tôi đánh giá <br /> con hàng này
          </Typography>
          <Typography variant="h2">{`${score} điểm`}</Typography>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {zennomi?.review || 'No comment'}
          </ReactMarkdown>
        </Typography>
      </ContentStyle>
    </Paper>
  );
}

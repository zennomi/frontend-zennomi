// @mui
import { Stack, Button, Typography } from '@mui/material';
// assets
import { DocIllustration } from '../../../assets';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Yahallo~
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Web đang lớn dần
          <br /> Lag là chuyện bình thường <em>*nháy mắt*</em>
          <br /> Sẽ không lag sớm thôi
        </Typography>
      </div>

      <Button variant="contained" href="https://www.facebook.com/Zennomi" target="_blank" component="a">Zennomi</Button>
    </Stack>
  );
}

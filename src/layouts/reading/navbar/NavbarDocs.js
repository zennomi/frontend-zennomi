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
          Loser chúa nào đây?
          <br /> Chính là mình, nữ sinh cao trung cute <em>*nháy mắt*</em>
        </Typography>
      </div>

      <Button variant="contained" href="https://www.facebook.com/Zennomi" target="_blank" component="a">Zennomi</Button>
    </Stack>
  );
}

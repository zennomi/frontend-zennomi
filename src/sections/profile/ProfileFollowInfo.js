import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

export default function ProfileFollowInfo() {

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(10000)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            người theo dõi
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(1000)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            bộ RomCom
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

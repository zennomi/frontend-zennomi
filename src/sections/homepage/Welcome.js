import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent } from '@mui/material';
import { SeoIllustration } from '../../assets';
import { PATH_WIBU } from '../../routes/paths';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

Welcome.propTypes = {
  displayName: PropTypes.string,
};

export default function Welcome({ displayName }) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          my: 3,
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
          Yahallo,
          <br /> {!displayName ? 'mother fucker' : displayName}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          Zennomi, một nam sinh viên đại học bình thường có thể tìm thấy ở bất cứ nơi đâu, nhân dịp nghỉ Tết 2022 đã
          code trang web chứa toàn bộ romcom nó đã đọc/xem.
        </Typography>

        <Button variant="contained" to={`${PATH_WIBU.title.root}`} component={RouterLink} sx={{ m: 1 }}>
          Tìm romcom
        </Button>

        <Button variant="contained" to={`${PATH_WIBU.read.root}`} component={RouterLink}>
          Đọc manga
        </Button>
      </CardContent>

      <SeoIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' },
          display: { xs: 'none', md: 'block' },
        }}
      />
    </RootStyle>
  );
}

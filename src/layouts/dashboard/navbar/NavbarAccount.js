import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// hooks
import useAuth from "../../../hooks/useAuth";
// components
import MyAvatar from '../../../components/MyAvatar';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const { user, isAuthenticated } = useAuth();


  return (
    isAuthenticated ?
      <Link underline="none" color="inherit">
        < RootStyle
          sx={{
            ...(isCollapse && {
              bgcolor: 'transparent',
            }),
          }
          }
        >
          <MyAvatar />
          <Box
            sx={{
              ml: 2,
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.shorter,
                }),
              ...(isCollapse && {
                ml: 0,
                width: 0,
              }),
            }}
          >
            <Typography variant="subtitle2" noWrap>
              {user.displayName}
            </Typography>
            <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
              {user.role}
            </Typography>
          </Box>
        </RootStyle >
      </Link > :
      <Button size="large" color="primary" variant="contained" component={RouterLink} to="/auth/login">Đăng nhập</Button>
  );
}

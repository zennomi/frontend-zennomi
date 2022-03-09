import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

export default function RoundedButton({ simple = true, path, color, name, icon, sx, children, ...other }) {

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {simple ? (
        <Link key={name} href={path}>
          <Tooltip title={name} placement="top">
            <IconButton
              color="inherit"
              sx={{
                color: color,
                '&:hover': {
                  bgcolor: alpha(color, 0.08),
                },
                ...sx,
              }}
              {...other}
            >
              {children}
            </IconButton>
          </Tooltip>
        </Link>
      ) : (
        <Button
          key={name}
          href={path}
          color="inherit"
          variant="outlined"
          size="small"
          startIcon={<Iconify icon={icon} />}
          sx={{
            m: 0.5,
            flexShrink: 0,
            color: color,
            borderColor: color,
            '&:hover': {
              borderColor: color,
              bgcolor: alpha(color, 0.08),
            },
            ...sx,
          }}
          {...other}
        >
          {children}
        </Button>
      )
      }
    </Stack>
  );
}

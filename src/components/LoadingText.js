import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
//
import ProgressBar from './ProgressBar';
import { FACTS } from '../constants';

// ----------------------------------------------------------------------

const FullScreenStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

const AreaStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 500
}));

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
  fullscreen: PropTypes.bool,
};

function FactComponent({text}) {
  return (
    <Typography variant="h3">{text}</Typography>
  )
}

export default function LoadingScreen({ fullscreen, ...other }) {
  const fact = FACTS[Math.random() * FACTS.length];
  return (
    <>
      <ProgressBar />

      {fullscreen ? (
        <FullScreenStyle {...other}>
          <FactComponent text={fact} />
        </FullScreenStyle>
      ) : (
        <AreaStyle {...other}>
          <FactComponent text={fact} />
        </AreaStyle>
      )

      }
    </>
  );
}

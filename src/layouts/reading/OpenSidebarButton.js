import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
// utils
import cssStyles from '../../utils/cssStyles';
//
import Iconify from '../../components/Iconify';
import { IconButtonAnimate } from '../../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('span')(({ theme }) => ({
    ...cssStyles(theme).bgBlur({ opacity: 0.64 }),
    left: 0,
    top: '24px',
    position: 'fixed',
    marginTop: theme.spacing(-3),
    padding: theme.spacing(0.5),
    zIndex: theme.zIndex.drawer + 2,
    borderRadius: '0 24px 24px 0',
    boxShadow: `-12px 12px 32px -4px ${alpha(
        theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.common.black,
        0.36
    )}`,
}));

// ----------------------------------------------------------------------

ToggleButton.propTypes = {
    onClick: PropTypes.func,
};

export default function ToggleButton({ onClick }) {

    return (
        <RootStyle>
            <Tooltip title="Menu" placement="right">
                <IconButtonAnimate
                    color="inherit"
                    onClick={onClick}
                    sx={{
                        p: 1.25,
                        transition: (theme) => theme.transitions.create('all'),
                        '&:hover': {
                            color: 'primary.main',
                            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
                        },
                    }}
                >
                    <Iconify icon="eva:options-2-fill" width={20} height={20} />
                </IconButtonAnimate>
            </Tooltip>
        </RootStyle>
    );
}

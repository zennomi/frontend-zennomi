import PropTypes from 'prop-types';
import merge from 'lodash/merge';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, Typography, Box, Link, CardActionArea } from '@mui/material';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(CardActionArea)(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.darker,
    justifyContent: 'start'
}));

const IconStyle = styled(Iconify)(({ theme }) => ({
    width: 120,
    height: 120,
    opacity: 0.12,
    position: 'absolute',
    right: theme.spacing(-3),
    color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

LinkWidget.propTypes = {
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default function LinkWidget({ title, icon, color = 'primary', description, link }) {
    const theme = useTheme();

    return (
        <Card>
            <RootStyle
                sx={{
                    bgcolor: theme.palette[color].darker,
                }}
                component={"a"}
                href={link}
                target="_blank"
            >
                <Box sx={{ ml: 3, color: 'common.white' }}>
                    <Typography variant="h4"> {title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.72 }}>
                        {description}
                    </Typography>
                </Box>
                <IconStyle icon={icon} />
            </RootStyle>
        </Card>
    );
}

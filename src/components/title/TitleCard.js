import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';

import { Typography, Card, CardActionArea, IconButton, Chip, Menu, MenuItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
// components
import Image from '../Image';
import Iconify from '../Iconify';
import TextMaxLine from '../TextMaxLine';
// utils
import cssStyles from '../../utils/cssStyles';
// paths
import { PATH_WIBU } from '../../routes/paths';

export default function TitleCard({ title }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Card>
            <Image src={title.coverArt[0]} alt={title.title?.en} ratio='4/6' />
            <OverlayStyle />
            <CaptionStyle component={RouterLink} to={`${PATH_WIBU.title.one}/${title._id}`}>
                <TextMaxLine line={2}>
                    <Typography width="100%" variant="subtitle1" component="span">{title.title?.en}</Typography>
                    {
                        title?.altTitle &&
                        <Typography width="100%" variant="body2" sx={{ opacity: 0.72 }} component="span">
                            {` - ${title?.altTitle}`}
                        </Typography>
                    }
                </TextMaxLine>
            </CaptionStyle>
            <Chip label={title.type} color="primary" size="small" sx={theme => ({ position: 'absolute', top: theme.spacing(0.5), left: theme.spacing(0.5), opacity: 0.9 })} />
        </Card>
    )
}


const OverlayStyle = styled('div')(({ theme }) => ({
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundImage: `linear-gradient(to top, ${theme.palette.grey[900]} 0%,${alpha(theme.palette.grey[900], 0)} 50%)`,
}));

const CaptionStyle = styled(CardActionArea)(({ theme }) => ({
    // ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'space-between',
    color: theme.palette.common.white,
    padding: theme.spacing(1),
}));
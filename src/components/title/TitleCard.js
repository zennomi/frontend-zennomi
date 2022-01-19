import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';

import { Typography, Card, CardActionArea, IconButton, Chip, Menu, MenuItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
// components
import Image from '../Image';
import Iconify from '../Iconify';
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
            <CaptionStyle component={RouterLink} to={`${PATH_WIBU.title.one}/${title._id}`}>
                <div style={{ width: "80%" }}>
                    <Typography width="100%" variant="subtitle1" noWrap>{title.title?.en}</Typography>
                    <Typography width="100%" variant="body2" sx={{ opacity: 0.72 }} noWrap>
                        {title.title?.ja}
                    </Typography>
                </div>
            </CaptionStyle>
            <IconButton
                color="primary"
                sx={{ position: 'absolute', top: 0, right: 0 }}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Iconify icon={'eva:more-vertical-fill'} />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => { navigate(`${PATH_WIBU.title.one}/${title._id}`) }}>
                    <ListItemIcon>
                        <Iconify icon={'eva:eye-fill'} />
                    </ListItemIcon>
                    <ListItemText>Xem</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Iconify icon={'eva:heart-fill'} />
                    </ListItemIcon>
                    <ListItemText>Đánh dấu</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { navigate(`${PATH_WIBU.title.one}/edit/${title._id}`) }}>
                    <ListItemText>Sửa</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { navigate(`${PATH_WIBU.title.one}/delete/${title._id}`) }}>
                    <ListItemText>Xoá</ListItemText>
                </MenuItem>
            </Menu>
            <Chip label={title.type} color="primary" size="small" sx={theme => ({ position: 'absolute', top: theme.spacing(0.5), left: theme.spacing(0.5), opacity: 0.9 })} />
        </Card>
    )
}


const CaptionStyle = styled(CardActionArea)(({ theme }) => ({
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'space-between',
    color: theme.palette.common.white,
    padding: theme.spacing(1),
}));
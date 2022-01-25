import { useState } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';

import { Typography, Card, CardActionArea, Chip, Skeleton } from '@mui/material';
// components
import Image from '../Image';

export default function TitleCardSkeleton() {
    return (
        <Card>
            <Image src={null} alt='PlaceHolder' ratio='4/6' />
            <OverlayStyle />
            <CaptionStyle>
                <Typography width="100%" variant="subtitle1" component="span"><Skeleton variant='text' /></Typography>
                <Typography width="100%" variant="body2" sx={{ opacity: 0.72 }} component="span">
                    <Skeleton variant='text' />
                </Typography>
            </CaptionStyle>
            <Chip label='_____' color="primary" size="small" sx={theme => ({ position: 'absolute', top: theme.spacing(0.5), left: theme.spacing(0.5), opacity: 0.9 })} />
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
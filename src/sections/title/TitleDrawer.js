import { useState, useRef, useEffect, useMemo } from 'react';

// components
import Iconify from '../../components/Iconify';
import { IconButtonAnimate } from '../../components/animate';
// @mui
import {
    Box,
    Stack,
    Drawer,
    Tooltip,
    Divider,
    Typography,
    Container,
} from '@mui/material';

// hooks
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_WIBU } from '../../routes/paths';

import TitleUpdateForm from './TitleUpdateForm';

export default function TitleDrawer({ title, onClose }) {
    const isDesktop = useResponsive('up', 'sm');

    return (
        <Drawer open={Boolean(title)} onClose={onClose} anchor="right" PaperProps={{ sx: { width: { xs: 1, sm: 480 }, py: 5 } }}>
            <Container>
                {!isDesktop && (
                    <>
                        <Tooltip title="Back">
                            <IconButtonAnimate onClick={onClose} sx={{ mr: 1 }}>
                                <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
                            </IconButtonAnimate>
                        </Tooltip>
                    </>
                )}
                <TitleUpdateForm title={title} onClose={onClose} />
            </Container>
        </Drawer>
    )
}
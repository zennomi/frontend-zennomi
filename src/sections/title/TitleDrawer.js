// components
import Iconify from '../../components/Iconify';
import { IconButtonAnimate } from '../../components/animate';
// @mui
import {
    Alert,
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
import TitleUpdateForm from './TitleUpdateForm';

export default function TitleDrawer({ title, onClose, setTitle }) {
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
                <Alert color='error'>Thông tin ở đây có thể chưa được cập nhật sau lần cập nhật trước, reload lại nếu cần</Alert>
                <TitleUpdateForm title={title} onClose={onClose} setTitle={setTitle}/>
            </Container>
        </Drawer>
    )
}
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Box, Button } from '@mui/material';
// components
import Iconify from '../../components/Iconify'


// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 2, 2, 3),
}));

// ----------------------------------------------------------------------

export default function MethodWidget({ method, number, img }) {
    const { enqueueSnackbar } = useSnackbar();
    return (
        <RootStyle>
            <div>
                <Typography variant="h5">{method}</Typography>
                <CopyToClipboard text={number} onCopy={() => { enqueueSnackbar("Đã copy!") }}>
                    <Button color="primary" size="small" endIcon={<Iconify icon={'eva:copy-fill'} width={24} height={24} />}>
                        {number}
                    </Button>
                </CopyToClipboard>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Nguyen Dang Tuan Anh
                </Typography>
            </div>
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    lineHeight: 0,
                    borderRadius: '50%',
                    bgcolor: 'background.neutral',
                }}
            >
                <img src={img} alt={method} />
            </Box>
        </RootStyle>
    );
}

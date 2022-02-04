// @mui
import { styled } from '@mui/material/styles';
import {
    Container, Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Stack,
    Box,
    Avatar,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
} from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import MethodWidget from '../sections/donate/MethodWidget';

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.lighter,
    [theme.breakpoints.up('md')]: {
        height: '100%',
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
}));

// ----------------------------------------------------------------------

const donators = [
    { name: 'A' },
    { name: 'A' },
    { name: 'A' },
    { name: 'A' },
]

export default function Donate() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Donate">
            <Container maxWidth={themeStretch ? false : 'md'}>
                <Stack spacing={2}>
                    <StyledCard>
                        <CardContent
                            sx={{
                                p: { md: 0 },
                                pl: { md: 5 },
                                my: 3,
                                color: 'grey.800',
                            }}
                        >
                            <Typography gutterBottom variant="h4">
                                Nếu web có ích cho bạn,
                            </Typography>

                            <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
                                hãy donate để mình có kinh phí duy trì web nhé. Hiện tại web đang sử dụng firebase hosting và backend bằng
                                heroku free nên khá dễ sập. Dự kiến nâng cấp trong tháng 3.
                            </Typography>

                            <Button variant="contained" href="https://www.facebook.com/Zennomi" target="_blank" component={"a"}>
                                Hỗ trợ riêng
                            </Button>
                        </CardContent>

                        <Box
                            sx={{
                                p: 3,
                                width: 300,
                                margin: { xs: 'auto', md: 'inherit' },
                                // display: { xs: 'none', md: 'block' }
                            }}
                        >
                            <img src="https://i.imgur.com/edcgj8i.png" />
                        </Box>
                    </StyledCard>
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <MethodWidget method="Momo" number="0969142728" img="https://i.imgur.com/ME6axyQ.png" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MethodWidget method="Vietinbank" number="105870480290" img="https://i.imgur.com/iHCm6Su.png" />
                            </Grid>
                        </Grid>
                    </div>
                    <Card sx={{ p: 1 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Top donate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        donators.map(donator =>
                                            <TableRow key={donator.name}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar color='primary'>{donator.name.slice(0, 1)}</Avatar>
                                                        <Box sx={{ ml: 2, maxWidth: { xs: 100, md: 200, xl: 400 } }}>
                                                            <Typography variant="subtitle2"> {donator.name}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Card>
                </Stack>
            </Container>
        </Page>
    );
}

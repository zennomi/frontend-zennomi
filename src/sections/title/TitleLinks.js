// @mui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Card,
    Table,
    Avatar,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    CardHeader,
    Typography,
    TableContainer,
    Link,
} from '@mui/material';
// utils
import { fCurrency } from '../../utils/formatNumber';
// _mock_
import { _ecommerceBestSalesman } from '../../_mock';
// components
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';
import Image from '../../components/Image';
import Scrollbar from '../../components/Scrollbar';
import TextMaxLine from '../../components/TextMaxLine';

// ----------------------------------------------------------------------

export default function TitleLinks({ links = { vi: [], en: [], raw: [] } }) {
    const theme = useTheme();

    return (
        <Card>
            <Scrollbar sx={{ maxHeight: 200, my: 1 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Site</TableCell>
                                <TableCell align='center'>Ngôn ngữ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {links.vi.map((row) => (
                                <Row row={row} language='vietnam' />
                            ))}
                        </TableBody>
                        <TableBody>
                            {links.en.map((row) => (
                                <Row row={row} language='united-kingdom' />
                            ))}
                        </TableBody>
                        <TableBody>
                            {links.raw.map((row) => (
                                <Row row={row} language='japan' />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>
        </Card>
    );
}

function LinkIcon({ site }) {
    if (site === 'BLOGTRUYEN.VN') return <img src='/icons/ic_blogtruyen.png' />
    else if (site === 'MANGADEX.ORG') return <img src='/icons/ic_mangadex.svg' />
    else if (site === 'HAKO.RE' || site === 'DOCLN.NET' ) return <img src='/icons/ic_hako.png' />
    else if (site === 'FACEBOOK.COM') return <Iconify icon='logos:facebook' />
    else if (site === 'Google-sensei') return <Iconify icon={'flat-color-icons:google'} />
    else if (site === 'TWITTER.COM') return <Iconify icon={'logos:twitter'} />
    else return <Iconify icon='fa-solid:link' />
}

function Row({ row, language }) {
    return (
        <TableRow key={row.link}>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar color='primary'><LinkIcon site={row.site} /></Avatar>
                    <Box sx={{ ml: 2, maxWidth: { xs: 100, md: 200, xl: 400 } }}>
                        <Typography variant="subtitle2"> {row.site}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            <Link href={row.link} target="_blank">{row.link}</Link>
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell align='center' sx={{ minWidth: 50 }}>
                <Iconify icon={`emojione-v1:flag-for-${language}`} sx={{ width: 32, height: 32 }} />
            </TableCell>
        </TableRow>)
}
import { Link as RouterLink } from 'react-router-dom';
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
    Typography,
    TableContainer,
    Link,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import EmptyContent from '../../components/EmptyContent'
// path
import { PATH_WIBU } from '../../routes/paths';


// ----------------------------------------------------------------------

export default function TitleLinks({ lists }) {
    return (
        <Card>
            <Scrollbar sx={{ maxHeight: 200, my: 1 }}>
                {
                    lists.length === 0 ?
                        <EmptyContent title="Bộ này không nằm trong bộ sưu tập nào" sx={{ mx: 'auto' }} /> :
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bộ sưu tập</TableCell>
                                        <TableCell align='center'>Số lượng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lists.map(list => (
                                    <TableRow key={list._id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar color='primary' src={list.user.photoURL} />
                                                <Box sx={{ ml: 2, maxWidth: { xs: 150, md: 200, xl: 400 } }}>
                                                    <Typography variant="subtitle2">
                                                        <Link component={RouterLink} to={`${PATH_WIBU.list.one}/${list._id}`} >{list.name}</Link>
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                        {`bởi ${list.user.displayName}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align='center'>{list.titles.length}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
            </Scrollbar>
        </Card>
    );
}

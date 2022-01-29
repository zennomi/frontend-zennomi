import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import parse from 'html-react-parser';
// @mui
import {
    Card,
    Stack,
    Paper,
    Avatar,
    TextField,
    Typography,
    CardHeader,
    IconButton,
    InputAdornment,
    Button,
    Box,
} from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
// utils
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
// components
import Iconify from '../../components/Iconify';
import MyAvatar from '../../components/MyAvatar';
import EmojiPicker from '../../components/EmojiPicker';

export default function TitleComment({ comments, handleCommentSubmit, handleCommentDelete }) {
    console.log('render');
    const { user, isAuthenticated } = useAuth();

    const [message, setMessage] = useState('');
    const handleChangeMessage = (value) => {
        setMessage(value);
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (!message) return;
        handleCommentSubmit(message);
        setMessage('');
    }

    return (
        <Card sx={{ overflow: 'visible' }}>
            <CardHeader title="Bình luận" />
            <Stack spacing={3} sx={{ p: 3 }}>
                <Stack spacing={1.5}>
                    {comments.map((comment) => (
                        <Stack key={comment._id} direction="row" spacing={2}>
                            <Avatar alt={comment.user.displayName} src={comment.user.photoURL} />
                            <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: 'background.neutral' }}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    alignItems={{ sm: 'center' }}
                                    justifyContent="space-between"
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography variant="subtitle2">{comment.user.displayName}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                        {formatDistance(new Date(comment.createdAt), new Date(), { locale: vi, addSuffix: true })}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {parse(comment.message)}
                                </Typography>
                                {user.id === comment.user.id &&
                                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                                        <Button color='error' size='small' onClick={() => { handleCommentDelete(comment._id) }}>Xoá comment</Button>
                                    </Box>
                                }
                            </Paper>
                        </Stack>
                    ))}
                </Stack>
                {
                    isAuthenticated &&
                    <form onSubmit={handleFormSubmit}>
                        <Stack direction="row" alignItems="center">
                            <MyAvatar />
                            <TextField
                                fullWidth
                                autoComplete="off"
                                size="small"
                                value={message}
                                placeholder="Bình luận gì đó…"
                                onChange={(event) => handleChangeMessage(event.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <EmojiPicker alignRight value={message} setValue={setMessage} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    ml: 2,
                                    mr: 1,
                                    '& fieldset': {
                                        borderWidth: `1px !important`,
                                        borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
                                    },
                                }}
                            />

                            <IconButton type="submit" >
                                <Iconify icon={'ic:round-send'} width={24} height={24} />
                            </IconButton>
                        </Stack>
                    </form>
                }
            </Stack>
        </Card>
    )

}
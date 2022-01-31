import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Link,
  Card,
  Stack,
  Paper,
  Avatar,
  Checkbox,
  TextField,
  Typography,
  CardHeader,
  IconButton,
  AvatarGroup,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import Mie from '../../assets/images/Mie.jpg';

// ----------------------------------------------------------------------

ProfilePostCard.propTypes = {
  post: PropTypes.object,
};

export default function ProfilePostCard({ post }) {

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={<Avatar src={Mie} />}
        title={
          <Link to="#" variant="subtitle2" color="text.primary" component={RouterLink}>
            Zennomi
          </Link>
        }
        subheader={
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            31/01/2022
          </Typography>
        }
        action={
          <IconButton>
            <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
          </IconButton>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography>Mình không phiền nếu được nhận lì xì đâu ạ.</Typography>
        <Typography color='info.main'>Vietinbank: 105870480290 - Nguyen Dang Tuan Anh</Typography>
        <Typography color='error.light'>Momo: 0969142728 - Nguyen Dang Tuan Anh</Typography>

        <Image alt="post media" src={`https://pbs.twimg.com/media/FJtx6ulX0AQd8LY?format=jpg&name=large`} ratio="16/9" sx={{ borderRadius: 1 }} />

        <Stack direction="row" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                color="error"
                checked={true}
                icon={<Iconify icon={'eva:heart-fill'} />}
                checkedIcon={<Iconify icon={'eva:heart-fill'} />}
              />
            }
            label={696969}
            sx={{ minWidth: 72, mr: 0 }}
          />
          {/* <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
            {post.personLikes.map((person) => (
              <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
            ))}
          </AvatarGroup> */}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <Iconify icon={'eva:message-square-fill'} width={20} height={20} />
          </IconButton>
          <IconButton>
            <Iconify icon={'eva:share-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        {/* {hasComments && (
          <Stack spacing={1.5}>
            {post.comments.map((comment) => (
              <Stack key={comment.id} direction="row" spacing={2}>
                <Avatar alt={comment.author.name} src={comment.author.avatarUrl} />
                <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: 'background.neutral' }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ sm: 'center' }}
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="subtitle2">{comment.author.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {fDate(comment.createdAt)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {comment.message}
                  </Typography>
                </Paper>
              </Stack>
            ))}
          </Stack>
        )} */}
      </Stack>
    </Card>
  );
}

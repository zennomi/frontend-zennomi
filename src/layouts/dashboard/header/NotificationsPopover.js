import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  Card,
} from '@mui/material';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// utils
import { fToNow } from '../../../utils/formatTime';
import axios from '../../../utils/axios';

// _mock_
import { _notifications } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import Image from '../../../components/Image';
import TextMaxLine from '../../../components/TextMaxLine';
// paths
import { PATH_WIBU } from '../../../routes/paths'

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const isMountedRef = useIsMountedRef();
  const [notifications, setNotifications] = useState(_notifications);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState(null);
  const [feeds, setFeeds] = useState([]);

  const getFeeds = useCallback(async () => {
    try {
      if (!open) return;
      const { data } = await axios.get('/v1/titles/feed', {
        params: { limit: 5, sortBy: 'timestamp:desc', populate: 'title' }
      });
      if (isMountedRef.current) {
        setFeeds(data.results);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, open]);

  useEffect(() => {
    getFeeds();
    return () => { setFeeds([]); }
  }, [getFeeds]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={0} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cập nhật chương mới của các bộ romcom
            </Typography>
          </Box>

          {/* {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )} */}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Mới
              </ListSubheader>
            }
          >
            {feeds.map((feed) => (
              <NotificationItem key={feed._id} feed={feed} />
            ))}
          </List>

          {/* <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List> */}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button component={RouterLink} to={`${PATH_WIBU.title.feed}`} fullWidth disableRipple>
            Xem tất cả
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ feed }) {
  const { provider, link, title, timestamp, isUnRead } = feed;
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      component="a"
      href={link}
      target="_blank"
    >
      <ListItemAvatar>
        <Card sx={{ borderRadius: 0.5 }}>
          <Image alt={title.name} src={title.coverArt[0]} sx={{ width: 50 }} />
        </Card>
      </ListItemAvatar>
      <ListItemText
        primary={<TextMaxLine>{title.name}</TextMaxLine>}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistance(new Date(timestamp), new Date(), { locale: vi, addSuffix: true })}
            {` trên ${provider}`}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}

// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import ProfilePostCard from './ProfilePostCard';

// ----------------------------------------------------------------------

export default function Profile() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileFollowInfo />
          <ProfileAbout />
          <ProfileSocialInfo />
        </Stack>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfilePostCard />
        </Stack>
      </Grid>
    </Grid>
  );
}

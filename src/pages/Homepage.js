// @mui
import { Container, Typography, Grid } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
// sections
import Welcome from '../sections/homepage/Welcome';
import Features from '../sections/homepage/Features';
import LinkWidget from '../sections/homepage/LinkWidget';

// ----------------------------------------------------------------------

export default function PageOne() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  return (
    <Page title="Trang chủ">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Welcome displayName={user?.displayName} />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <LinkWidget
              title="Blog cá nhân"
              link="https://www.facebook.com/Zennomi"
              description="của Zennomi"
              icon="akar-icons:facebook-fill"
            />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <LinkWidget
              title="Github"
              link="https://github.com/zennomi"
              description="của Zennomi"
              icon="ant-design:github-filled"
            />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <LinkWidget
              title="Group Rom-Com"
              link="https://www.facebook.com/groups/romcom.dabezt"
              description="toàn dân hảo ngọt"
              icon="el:group"
            />
          </Grid>
          <Grid item xs={12} md={6} xl={3}>
            <LinkWidget
              title="Discord"
              link="https://discord.gg/KdpNM3HSuw"
              description="của động rom-com"
              icon="akar-icons:discord-fill"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

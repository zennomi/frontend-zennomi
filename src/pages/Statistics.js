// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// ----------------------------------------------------------------------

export default function Statistics() {
    const { themeStretch } = useSettings();

    return (
        <Page title="Page Two">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <HeaderBreadcrumbs
                    heading="Thống kê"
                    links={[
                        { name: "Thống kê", href: "/statistics" },
                    ]}
                />
                <Typography variant="h3" component="h1" paragraph>
                    Trang thống kê
                </Typography>
                <Typography gutterBottom>
                    Trang này sẽ dùng để thống kê tổng số bộ từng loại, thể loại, danh mục.
                </Typography>
                <Typography>
                    Backend dùng Redis đã xong chờ vọc cách sử dụng thư viện Chart.
                </Typography>
            </Container>
        </Page>
    );
}

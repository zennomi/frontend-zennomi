import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Grid, Typography, Paper, Card, CardContent, IconButton, Link, CardActionArea, Chip, Pagination, Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
// utils
import axios from '../../utils/axios';
import cssStyles from '../../utils/cssStyles';
// paths
import { PATH_WIBU } from '../../routes/paths';

// ----------------------------------------------------------------------

const CaptionStyle = styled(CardActionArea)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
  padding: theme.spacing(1),
}));

const TitleItem = ({ title }) => {
  const smUp = useResponsive('up', 'sm');
  return (
    <Grid item xs={3} key={title._id}>
      <Card>
        <Image src={title.coverArt[0]} alt={title.title?.en} ratio='4/6' />
        <CaptionStyle component={RouterLink} to={`${PATH_WIBU.title.one}/${title._id}`}>
          <div style={{ width: "80%" }}>
            <Typography width="100%" variant="subtitle1" noWrap>{title.title?.en}</Typography>
            <Typography width="100%" variant="body2" sx={{ opacity: 0.72 }} noWrap>
              {title.title?.ja}
            </Typography>
          </div>
        </CaptionStyle>
        <IconButton color="primary" sx={{ position: 'absolute', top: 0, right: 0 }}>
          <Iconify icon={'eva:more-vertical-fill'} />
        </IconButton>
        <Chip label={title.type} color="primary" size="small" sx={theme => ({ position: 'absolute', top: theme.spacing(0.5), left: theme.spacing(0.5), opacity: 0.9 })} />
      </Card>
    </Grid>
  )
}

export default function Titles() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();

  const [titles, setTitles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
  const [total, setTotal] = useState(1);

  const getTitles = useCallback(async () => {
    try {
      const { data } = await axios.get('/v1/titles', {
        params: {
          page,
          limit: 12,
          sortBy: "_id"
        }
      });
      if (isMountedRef.current) {
        setTitles(data.results);
        setTotal(data.totalPages);
      }
    } catch (err) {
      //
    }
  }, [isMountedRef, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  useEffect(() => {
    setSearchParams({ page });
    getTitles();
  }, [getTitles]);

  return (
    <Page title="Thư viện">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Thư viện của Zennomi"
          links={[
            { name: PATH_WIBU.label, href: PATH_WIBU.root },
            { name: PATH_WIBU.title.label, href: PATH_WIBU.title.root },
          ]}
        />
        <Grid container spacing={2}>
          {
            titles.map(title => <TitleItem title={title} />)
          }
        </Grid>
        <Box sx={{display: 'flex', justifyContent: 'right'}}>
          <Pagination sx={{ my: 2 }} count={total} page={page} onChange={handlePageChange} />
        </Box>
      </Container>
    </Page>
  );
}

import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// @mui
import { Container, Grid, Typography, Button, Card, Link, Pagination, Box, CardActionArea, ToggleButtonGroup, ToggleButton } from '@mui/material';
// hooks
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
// utils
import axios from '../../utils/axios';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale'
// paths
import { PATH_WIBU } from '../../routes/paths';
import Image from '../../components/Image';

// ----------------------------------------------------------------------

const PROVIDER_OPTION = ['blogtruyen', 'mangadex', 'novelupdate'];

export default function TitleFeed() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const [feeds, setFeeds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [total, setTotal] = useState(1);

  const getFeeds = useCallback(async () => {
    try {
      const { data } = await axios.get('/v1/titles/feed', {
        params: { ...paramsToObject(searchParams), limit: 12, sortBy: 'timestamp:desc', populate: 'title' }
      });
      if (isMountedRef.current) {
        setFeeds(data.results);
        setTotal(data.totalPages);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err, { variant: 'error' });
    }
  }, [isMountedRef, searchParams]);

  const handlePageChange = (event, page) => {
    setNewParams({ page });
  }

  const setNewParams = (params) => {
    const newParams = paramsToObject(searchParams);
    Object.keys(params).forEach(key => {
      if (params[key] === null) delete newParams[key];
      else newParams[key] = params[key];
    });
    setSearchParams({
      ...newParams
    })
  }

  useEffect(() => {
    getFeeds();
    return () => { setFeeds([]); }
  }, [getFeeds]);

  const handleProviderClick = (event, _provider) => {
    if (_provider === searchParams.get("provider")) setNewParams({ provider: null, page: 1 });
    else setNewParams({ provider: _provider, page: 1 });
  }

  return (
    <Page title="Thuốc mới">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Thuốc mới"
          links={[
            { name: PATH_WIBU.label, href: PATH_WIBU.root },
            { name: PATH_WIBU.title.label, href: PATH_WIBU.title.root },
          ]}
        />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <ToggleButtonGroup
            color="primary"
            value={searchParams.get("provider")}
            exclusive
            onChange={handleProviderClick}
            fullWidth
            sx={{ mb: 3 }}
          >
            {
              PROVIDER_OPTION.map(_provider => (
                <ToggleButton
                  value={_provider}
                  key={_provider}
                >
                  {_provider.toUpperCase()}
                </ToggleButton>
              ))
            }
          </ToggleButtonGroup>
        </Grid>
        <Grid container spacing={2}>
          {
            feeds.map(
              ({ title, timestamp, provider, link, description, _id }) =>
                <Grid item xs={12} md={6} key={_id}>
                  <Card sx={{ p: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={2}>
                        <Card sx={{ borderRadius: 1 }}>
                          <CardActionArea component={RouterLink} to={`${PATH_WIBU.title.one}/${title._id}`}>
                            <Image src={title.coverArt[0]} ratio='3/4' />
                          </CardActionArea>
                        </Card>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography component={Link} href={link} target="_blank" variant='h6' color="primary.main">{description || title.name}</Typography>
                        <Typography variant='body1'>{title.altTitle}</Typography>
                        <Typography variant='body2' sx={{ opacity: 0.72 }}>
                          {`Cập nhật lần cuối vào ${formatDistance(new Date(timestamp), new Date(), { locale: vi, addSuffix: true })} tại `}
                          <Button component={Link} href={link} target="_blank">{provider}</Button>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
            )
          }
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
        </Box>
      </Container >
    </Page >
  );
}

function paramsToObject(urlParams) {
  const entries = urlParams.entries();
  const result = {}
  for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
    result[key] = value;
  }
  return result;
}
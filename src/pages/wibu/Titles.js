import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
// @mui
import { Container, Grid, Typography, Button, Card, CardContent, IconButton, Link, CardActionArea, Chip, Pagination, Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import TitleCard from '../../components/title/TitleCard';
// utils
import axios from '../../utils/axios';
// paths
import { PATH_WIBU } from '../../routes/paths';

// ----------------------------------------------------------------------

const TYPE_OPTION = ['manga', 'novel', 'anime']

const TitleItem = ({ title }) => {
  return (
    <Grid item xs={3} key={title._id}>
      <TitleCard title={title} />
    </Grid>
  )
}

export default function Titles() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();

  const [titles, setTitles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const [total, setTotal] = useState(1);

  const getTitles = useCallback(async () => {
    try {
      const { data } = await axios.get('/v1/titles', {
        params: { ...paramsToObject(searchParams), limit: 12 }
      });
      if (isMountedRef.current) {
        setTitles(data.results);
        setTotal(data.totalPages);
      }
    } catch (err) {
      //
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
    getTitles();
    return () => { setTitles([]); }
  }, [getTitles]);

  const handleTypeClick = (_type) => {
    if (_type === searchParams.get("type")) setNewParams({ type: null, page: 1 });
    else setNewParams({ type: _type, page: 1 });
  }

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
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {
            TYPE_OPTION.map(_type => (
              <Grid item xs={4}>
                <Button
                  fullWidth
                  color='primary'
                  variant={_type === searchParams.get("type") ? "contained" : "outlined"}
                  onClick={() => { handleTypeClick(_type) }}
                >
                  {_type}
                </Button>
              </Grid>
            ))
          }
        </Grid>
        <Grid container spacing={2}>
          {
            titles.map(title => <TitleItem title={title} />)
          }
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
        </Box>
      </Container>
    </Page>
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
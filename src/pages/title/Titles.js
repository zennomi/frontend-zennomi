import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
// @mui
import { Alert, Container, Grid, Button, IconButton, Pagination, Box, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
// hooks
import { useSnackbar } from 'notistack';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useAuth from '../../hooks/useAuth';

// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import TitleCard from '../../components/title/TitleCard';
import TitleCardSkeleton from '../../components/title/TitleCardSkeleton';
import Iconify from '../../components/Iconify';
// sections
import TitleDrawer from '../../sections/title/TitleDrawer';
import FilterDrawer from '../../sections/title/FilterDrawer';
// utils
import axios from '../../utils/axios';
// paths
import { PATH_WIBU } from '../../routes/paths';
//
import { TYPE_OPTION } from '../../constants';

// ----------------------------------------------------------------------

export default function Titles() {
  const { themeStretch } = useSettings();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [title, setTitle] = useState();
  const [titles, setTitles] = useState([]);
  const [total, setTotal] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({ page: 1, sortBy: 'score:desc' });

  const toggleButtonRef = useRef(null);

  const getTitles = useCallback(async () => {
    try {
      const { data } = await axios.get('/v1/titles', {
        params: { ...paramsToObject(searchParams), limit: 24 }
      });
      if (isMountedRef.current) {
        setTitles(data.results);
        setTotal(data.totalPages);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err, { variant: 'error' });
    }
    if (toggleButtonRef.current) {
      toggleButtonRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isMountedRef, searchParams]);

  const handlePageChange = (event, page) => {
    setNewParams({ page });
  }

  const setNewParams = (params) => {
    if (!params.page) params.page = 1;
    const newParams = paramsToObject(searchParams);
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === 'all' || params[key] === '' || !params[key]) delete newParams[key];
      else newParams[key] = params[key];
    });
    setSearchParams({
      ...newParams
    })
  }

  const handleClose = () => {
    setTitle(null);
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  }

  useEffect(() => {
    if (title) return;
    getTitles();
    return () => { setTitles([]); }
  }, [getTitles]);

  const handleTypeClick = (event, _type) => {
    if (!_type) setNewParams({ type: null, page: 1 });
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
        <ToggleButtonGroup
          ref={toggleButtonRef}
          color="primary"
          value={searchParams.get("type")}
          exclusive
          onChange={handleTypeClick}
          fullWidth
          sx={{ mb: 3 }}
        >
          {
            TYPE_OPTION.map(_type => (
              <ToggleButton
                value={_type}
                key={_type}
              >
                {_type.toUpperCase()}
              </ToggleButton>
            ))
          }
        </ToggleButtonGroup>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            startIcon={<Iconify icon='bi:filter' />}
            endIcon={<Chip label={Object.keys(paramsToObject(searchParams)).length - 2} size='small' color='info' />}
            color='info'
            variant="outlined"
            onClick={() => { setIsFilterOpen(true) }}
            sx={{ mb: 2, mr: 2 }}
          >
            Lọc
          </Button>
        </Box>
        <Grid container spacing={3}>
          {
            titles.length === 0 ?
              Array(24).fill(
                <Grid item xs={4} md={2}>
                  <TitleCardSkeleton />
                </Grid>
              ) :
              titles.map(
                title =>
                  <Grid item xs={4} md={2}key={title._id}>
                    < div style={{ position: 'relative' }}>
                      <TitleCard title={title} />
                      {
                        user.isStaff &&
                        <IconButton
                          color="primary"
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                          aria-haspopup="true"
                          onClick={() => setTitle(title)}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      }
                    </div>
                  </Grid>
              )
          }
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'right' }}>
          <Pagination sx={{ my: 2 }} count={total} page={Number(searchParams.get("page"))} onChange={handlePageChange} />
        </Box>
        <Alert severity="success" sx={{ mb: 1 }}>Cập nhật bộ lọc theo tựa đề đã chính xác hơn, thêm một số thuộc tính</Alert>
        <Alert severity="info">Thông tin từng bộ còn thiếu khá nhiều, bạn nào có nhã ý muốn đóng góp thì liên lạc với mình nhé!</Alert>
        {user.isStaff && <TitleDrawer title={title} onClose={handleClose} setTitle={setTitle} />}
        <FilterDrawer isOpen={isFilterOpen} onClose={handleFilterClose} setNewParams={setNewParams} />
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
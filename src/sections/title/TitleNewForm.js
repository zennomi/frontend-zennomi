import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { decode } from 'html-entities';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete } from '@mui/material';
// routes
import { PATH_WIBU } from '../../routes/paths';
// components
import {
  FormProvider,
  RHFSelect,
  RHFEditor,
  RHFTextField,
} from '../../components/hook-form';

// ----------------------------------------------------------------------

const TYPE_OPTION = ['novel', 'manga', 'anime'];

const STATUS_OPTION = ['hiatus', 'ongoing', 'completed', 'cancelled'];

const GENRES_OPTION = [
  'action',
  'adult',
  'adventure',
  'comedy',
  'doujinshi',
  'drama',
  'ecchi',
  'fantasy',
  'gender bender',
  'harem',
  'hentai',
  'historical',
  'horror',
  'josei',
  'lolicon',
  'martial arts',
  'mature',
  'mecha',
  'mystery',
  'psychological',
  'romance',
  'school life',
  'sci-fi',
  'seinen',
  'shotacon',
  'shoujo',
  'shoujo ai',
  'shounen',
  'shounen ai',
  'slice of Life',
  'smut',
  'sports',
  'supernatural',
  'tragedy',
  'yaoi',
  'yuri'
]

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

TitleNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTitle: PropTypes.object,
  titleSubmit: PropTypes.func
};

export default function TitleNewForm({ isEdit, currentTitle, titleSubmit }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    title: Yup.object().shape({
      en: Yup.string().required('Name is required'),
    }),
    coverArt: Yup.array().of(Yup.string()).min(1, "Cần có bìa"),
  });

  const defaultValues = useMemo(
    () => ({
      title: {
        en: currentTitle?.title.en || '',
        vi: currentTitle?.title.vi || '',
        ja: currentTitle?.title.ja || ''
      },
      description: currentTitle?.description ? decode(currentTitle.description) : '',
      genres: currentTitle?.genres || ['romance', 'comedy'],
      coverArt: currentTitle?.coverArt || [],
      tags: currentTitle?.tags || [],
      links: {
        raw: currentTitle?.links.raw || [],
        vi: currentTitle?.links.vi || [],
      },
      author: currentTitle?.author || [],
      artist: currentTitle?.artist || [],
      status: currentTitle?.status || 'ongoing',
      type: currentTitle?.type || 'manga'
    }),
    [currentTitle]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentTitle) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentTitle]);

  const onSubmit = async (title) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.log(title);
      const { data } = await titleSubmit(title);
      const { data: newTitle } = data;
      console.log({newTitle})
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(`${PATH_WIBU.title.one}/${newTitle._id}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <RHFTextField name="title.en" label="Tựa đề phổ biến" />
              <RHFTextField name="title.ja" label="Tựa gốc" />
              <RHFTextField name="title.vi" label="Tựa tiếng Việt" />
              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
              <Controller
                name="coverArt"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={[]}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }

                    renderInput={(params) => <TextField label="Bìa" error={!!error} helperText={error?.message} {...params} />}
                  />
                )}
              />
              <Controller
                name="links.raw"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={[]}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Link raw" {...params} />}
                  />
                )}
              />
              <Controller
                name="links.vi"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={[]}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Link việt" {...params} />}
                  />
                )}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFSelect name="type" label="Type">
                  {TYPE_OPTION.map((status) => (
                    <option>{status}</option>
                  ))}
                </RHFSelect>

                <RHFSelect name="status" label="Status">
                  {STATUS_OPTION.map((status) => (
                    <option>{status}</option>
                  ))}
                </RHFSelect>
                <Controller
                  name="genres"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      onChange={(event, newValue) => field.onChange(newValue)}
                      options={GENRES_OPTION.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Genres" {...params} />}
                    />
                  )}
                />
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      freeSolo
                      options={[]}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Controller
                name="author"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={[]}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Tác giả" {...params} />}
                  />
                )}
              />
              <Controller
                name="artist"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={[]}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Hoạ sĩ" {...params} />}
                  />
                )}
              />
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Title' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

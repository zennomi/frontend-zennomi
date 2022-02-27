import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useCallback } from 'react';
import isString from 'lodash/isString';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, Box, InputAdornment } from '@mui/material';
// routes
import { PATH_WIBU } from '../../routes/paths';
// components
import {
  FormProvider,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFUploadMultiFile,
  RHFSwitch
} from '../../components/hook-form';
import Label from '../../components/Label';
// utils
import imgur from '../../utils/imgur';
import { TYPE_OPTION, STATUS_OPTION, GENRE_OPTION, TAG_OPTION } from '../../constants';

// ----------------------------------------------------------------------

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

  const TitleSchema = Yup.object().shape({
    title: Yup.object().shape({
      en: Yup.string().required('Name is required'),
    }),
    coverArt: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: {
        en: currentTitle?.titles[0] || '',
        vi: currentTitle?.titles[1] || '',
        raw: currentTitle?.titles[2] || ''
      },
      titles: currentTitle?.titles.slice(3) || [],
      description: currentTitle?.description || '',
      genres: currentTitle?.genres || ['romance', 'comedy'],
      coverArt: currentTitle?.coverArt.filter(c => Boolean(c)) || [],
      tags: currentTitle?.tags || [],
      urls: {
        raw: currentTitle?.urls.raw || [],
        vi: currentTitle?.urls.vi || [],
        en: currentTitle?.urls.en || [],
      },
      isLisensed: currentTitle?.isLisensed || false,
      staff: currentTitle?.staff || [],
      originalLanguage: currentTitle?.originalLanguage || 'ja',
      status: currentTitle?.status || 'ongoing',
      type: currentTitle?.type || 'manga',
      zennomi: currentTitle?.zennomi || {
        isMyProject: false,
        review: ""
      },
      score: currentTitle?.score || 0
    }),
    [currentTitle]
  );

  const methods = useForm({
    resolver: yupResolver(TitleSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
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
      title.titles = [...Object.values(title.title), ...title.titles]
      console.log(title);
      const linkFiles = title.coverArt.filter(link => isString(link));
      const base64Files = await Promise.all(title.coverArt.filter(link => !isString(link)).map(file => getBase64(file)));
      const imgurLinks = await imgur.upload(base64Files.map(file => ({ image: file.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), type: 'base64' })));
      if (imgurLinks.includes(null)) throw "Imgur error";
      title.coverArt = [...imgurLinks.map(e => e.data.link), ...linkFiles];
      const { data } = await titleSubmit({ ...title });
      const { data: newTitle } = data;
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(`${PATH_WIBU.title.one}/${newTitle._id}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { color: 'error' });
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setValue(
        'coverArt',
        [...getValues('coverArt'), ...acceptedFiles].map(file =>
          isString(file) ? file : Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('coverArt', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.coverArt?.filter((_file) => _file !== file);
    setValue('coverArt', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <RHFTextField name="title.en" label="Tựa đề phổ biến" />
              <RHFTextField name="title.vi" label="Tựa tiếng Việt" />
              <RHFTextField name="title.raw" label="Tựa gốc" />
              <Controller
                name="titles"
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
                    renderInput={(params) => <TextField label="Các tựa khác" {...params} />}
                  />
                )}
              />
              <div>
                <LabelStyle>Nội dung</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
              <div>
                <LabelStyle>Zennomi review</LabelStyle>
                <RHFEditor simple name="zennomi.review" />
              </div>
              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadMultiFile
                  name="coverArt"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </div>

              <Controller
                name="urls.vi"
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
              <Controller
                name="urls.raw"
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
                name="urls.en"
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
                    renderInput={(params) => <TextField label="Link eng" {...params} />}
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
                <RHFSwitch name="zennomi.isMyProject" label="Dự án của Zennomi" />
                <RHFSwitch name="isLisensed" label="Có bản quyền" />

                <RHFTextField
                  name="score"
                  label="Điểm số"
                  placeholder="0.00"
                  value={getValues('score') === 0 ? '' : getValues('score')}
                  onChange={(event) => setValue('score', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">/100</InputAdornment>,
                    type: 'number',
                  }}
                />

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
                      options={GENRE_OPTION.map((option) => option)}
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
                      options={TAG_OPTION.map((option) => option)}
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
                name="staff"
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
                name="originalLanguage"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={['ja', 'vi'].map((option) => option)}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderInput={(params) => <TextField label="Ngôn ngữ gốc" {...params} />}
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

const getBase64 = file => {
  return new Promise(resolve => {
    let fileInfo;
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();
    // Convert the file to base64 text
    reader.readAsDataURL(file);
    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};
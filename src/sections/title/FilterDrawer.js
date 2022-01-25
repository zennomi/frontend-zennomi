import { useMemo, useEffect } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// components
import Iconify from '../../components/Iconify';
import { IconButtonAnimate } from '../../components/animate';
// @mui
import { styled } from '@mui/material/styles';
import {
    Autocomplete,
    Chip,
    Stack,
    TextField,
    Drawer,
    Tooltip,
    Divider,
    Typography,
    Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import {
    FormProvider,
    RHFSelect,
    RHFEditor,
    RHFTextField,
    RHFUploadMultiFile,
    RHFSwitch
} from '../../components/hook-form';
// utils
import paramsToObject from '../../utils/urlParamsHelper';
import { TYPE_OPTION, STATUS_OPTION, GENRE_OPTION, TAG_OPTION } from '../../constants';

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

export default function FilterDrawer({ isOpen, onClose }) {
    const isDesktop = useResponsive('up', 'sm');
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const currentFilter = paramsToObject(searchParams);
    if (currentFilter.genres) currentFilter.genres = currentFilter.genres.split(",");
    if (currentFilter.tags) currentFilter.tags = currentFilter.tags.split(",");

    console.log(currentFilter);
    const defaultValues = useMemo(
        () => ({
            query: currentFilter?.query || '',
            genres: currentFilter?.genres || ['romance', 'comedy'],
            tags: currentFilter?.tags || [],
            isLisensed: currentFilter?.isLisensed || false,
            author: currentFilter?.author || [],
            artist: currentFilter?.artist || [],
            status: currentFilter?.status || 'ongoing',
            type: currentFilter?.type || 'manga',
        }),
        [currentFilter]
    );

    const FilterSchema = Yup.object().shape({

    });

    const methods = useForm({
        resolver: yupResolver(FilterSchema),
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
        reset(defaultValues);
    }, [searchParams]);

    const onSubmit = async (filter) => {
        console.log(filter);
        if (filter.genres.length > 0) filter.genres = filter.genres.join(",");
        if (filter.tags.length > 0) filter.tags = filter.tags.join(",");
        setSearchParams(filter);
        try {
            enqueueSnackbar('Update filter success!');
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error.message);
        }
    };

    return (
        <Drawer open={isOpen} onClose={onClose} anchor="right" PaperProps={{ sx: { width: { xs: 1, sm: 480 }, py: 5 } }}>
            <Container>
                {!isDesktop && (
                    <>
                        <Tooltip title="Back">
                            <IconButtonAnimate sx={{ mr: 1 }}>
                                <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
                            </IconButtonAnimate>
                        </Tooltip>
                    </>
                )}
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={1}>
                        <RHFTextField name="query" label="Tên" />

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
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                            Lọc
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </Container>
        </Drawer>
    )
}
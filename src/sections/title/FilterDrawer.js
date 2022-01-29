import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    RHFTextField,
} from '../../components/hook-form';
// utils
import paramsToObject from '../../utils/urlParamsHelper';
import { TYPE_OPTION, STATUS_OPTION, GENRE_OPTION, TAG_OPTION } from '../../constants';

const SORT_OPTION = [
    {name: 'Điểm xếp hạng', value: 'score:desc'},
    {name: 'Ngày thêm', value: 'createdAt:desc'},
    {name: 'Tựa đề', value: 'title.en:asc'},
]

export default function FilterDrawer({ isOpen, onClose, setNewParams }) {
    const isDesktop = useResponsive('up', 'sm');
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentFilter = paramsToObject(searchParams);
    if (currentFilter.genres) currentFilter.genres = currentFilter.genres.split(",");
    if (currentFilter.tags) currentFilter.tags = currentFilter.tags.split(",");

    const defaultValues = useMemo(
        () => ({
            query: currentFilter?.query || '',
            genres: currentFilter?.genres || ['romance', 'comedy'],
            tags: currentFilter?.tags || [],
            isLisensed: currentFilter?.isLisensed || false,
            author: currentFilter?.author || [],
            artist: currentFilter?.artist || [],
            status: currentFilter?.status || 'all',
            type: currentFilter?.type || 'all',
            sortBy: currentFilter?.sortBy || 'score:desc',
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
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [searchParams]);

    const onSubmit = async (filter) => {
        if (filter.genres.length > 0) filter.genres = filter.genres.join(",");
        if (filter.tags.length > 0) filter.tags = filter.tags.join(",");
        if (!filter.isLisensed) delete filter.isLisensed;
        setNewParams(filter);
        enqueueSnackbar('Áp dụng bộ lọc!');
        onClose();
    };

    return (
        <Drawer open={isOpen} onClose={onClose} anchor="right" PaperProps={{ sx: { width: { xs: 1, sm: 480 }, py: 5 } }}>
            <Container>
                {!isDesktop && (
                    <>
                        <Tooltip title="Back">
                            <IconButtonAnimate onClick={onClose} sx={{ mr: 1 }}>
                                <Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />
                            </IconButtonAnimate>
                        </Tooltip>
                    </>
                )}
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={1}>
                        <RHFTextField name="query" label="Tên" />

                        <RHFSelect name="type" label="Hình thức">
                            {[...TYPE_OPTION, 'all'].map((status) => (
                                <option>{status}</option>
                            ))}
                        </RHFSelect>
                        <RHFSelect name="status" label="Trạng thái">
                            {[...STATUS_OPTION, 'all'].map((status) => (
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
                                    renderInput={(params) => <TextField label="Thể loại" {...params} />}
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
                                    renderInput={(params) => <TextField label="Danh mục" {...params} />}
                                />
                            )}
                        />
                        <RHFSelect name="sortBy" label="Xếp theo">
                            {SORT_OPTION.map(({name, value}) => (
                                <option value={value}>{name}</option>
                            ))}
                        </RHFSelect>
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                            {"Lọc & Sắp xếp"}
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </Container>
        </Drawer>
    )
}
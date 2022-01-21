import { useState, useRef, useEffect, useMemo } from 'react';

// components
import Iconify from '../../components/Iconify';
import { IconButtonAnimate } from '../../components/animate';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
} from '../../components/hook-form';
// @mui
import {
    Box,
    Stack,
    Drawer,
    Button,
    Tooltip,
    Divider,
    TextField,
    Typography,
    Container,
    InputAdornment,
    Autocomplete,
    Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import { updateTitle } from '../../utils/axios';
// routes
import { PATH_WIBU } from '../../routes/paths';
import { TYPE_OPTION, STATUS_OPTION, GENRE_OPTION } from '../../constants';

export default function TitleUpdateForm({ title, onClose }) {
    const { enqueueSnackbar } = useSnackbar();

    const defaultValues = useMemo(
        () => ({
            _id: title?._id || '',
            title: {
                en: title?.title.en || '',
                vi: title?.title.vi || '',
                ja: title?.title.ja || ''
            },
            genres: title?.genres || ['romance', 'comedy'],
            tags: title?.tags || [],
            author: title?.author || [],
            artist: title?.artist || [],
            status: title?.status || 'ongoing',
            type: title?.type || 'manga',
            zennomi: title?.zennomi || {
                isMyProject: false,
                review: ""
            },
            score: title?.score || 0
        }),
        [title]
    );
    const methods = useForm({
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
    }, [title]);

    const onSubmit = async (title) => {
        try {
            reset();
            console.log(title);
            await updateTitle(title);
            enqueueSnackbar('Update success!');
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error.message);
        }
        onClose();
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <Typography variant='h5'>{title?.title.en}</Typography>

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
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                                ))
                            }
                            renderInput={(params) => <TextField label="Tags" {...params} />}
                        />
                    )}
                />

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
                <div>
                    <RHFTextField name="zennomi.review" label="Zennomi review" multiline maxRows={8} />
                </div>
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>Update</LoadingButton>
            </Stack>
        </FormProvider>
    )
}
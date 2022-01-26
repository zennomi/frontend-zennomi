import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
// @mui
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import {
    FormProvider,
    RHFMultiCheckbox
} from '../../components/hook-form';
export default function ListSelectForm({ userLists, titleId, onSubmit }) {
    const defaultValues = useMemo(
        () => ({
            lists: userLists?.filter(list => list.titles.includes(titleId)) || [],
        }),
        [userLists]
    );
    const methods = useForm({
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, []);

    return (
        <Box sx={{ p: 1 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <RHFMultiCheckbox
                name='lists'
                options={userLists}
                />
            <LoadingButton type="submit" fullWidth loading={isSubmitting}>Lưu</LoadingButton>
            </FormProvider>
        </Box>
    )
}
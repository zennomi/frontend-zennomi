import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { uniqBy } from 'lodash';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, CardHeader, CardContent, Alert } from '@mui/material';
// routes
import { PATH_WIBU } from '../../routes/paths';
// components
import {
    FormProvider,
    RHFEditor,
    RHFTextField,
} from '../../components/hook-form';
import TitleSearch from '../title/TitleSearch';
import ListDragAndDrop from './ListDragAndDrop';
// utils
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.sublist2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ListNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentList: PropTypes.object,
};

export default function ListNewForm({ isEdit, currentList }) {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const ListSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        titles: Yup.array().min(0, 'Images is required'),
    });

    const defaultValues = useMemo(
        () => ({
            name: currentList?.name || '',
            description: currentList?.description || '',
            titles: currentList?.titles || [],
        }),
        [currentList]
    );

    const methods = useForm({
        resolver: yupResolver(ListSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        getValues,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentList) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentList]);

    const onSubmit = async (data) => {
        try {
            let id;
            data.titles = data.titles.map(t => t.id);
            if (isEdit) {
                const { data: { _id } } = await axiosInstance({
                    url: `/v1/lists/${currentList._id}`,
                    method: 'post',
                    data
                })
                id = _id;
            } else {
                const { data: { _id } } = await axiosInstance({
                    url: '/v1/lists',
                    method: 'post',
                    data
                })
                id = _id;
            }
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            navigate(`${PATH_WIBU.list.one}/${id}`);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error, { color: 'error' });
        }
    };

    const handleDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newItems = reorder(
            values.titles,
            result.source.index,
            result.destination.index
        );

        setValue('titles', newItems);
    }

    const handleAddButtonClick = (titles) => {
        setValue('titles', uniqBy([...values.titles, ...titles], 'id'));
    }

    const handleRemoveButtonClick = (titleId) => {
        setValue('titles', values.titles.filter(t => t.id !== titleId));
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 1 }}>
                        <CardHeader title="Th??ng tin b??? s??u t???p" />
                        <CardContent>
                            <Stack spacing={1}>
                                <RHFTextField name="name" label="T??n b??? s??u t???p" />
                                <div>
                                    <LabelStyle>M?? t??? b??? s??u t???p n??y</LabelStyle>
                                    <RHFEditor simple name="description" />
                                </div>
                            </Stack>
                        </CardContent>
                    </Card>
                    {isEdit && <Alert severity="info">Ngo??i c??ch th??m th??? c??ng n??y, b???n c?? th??? th??m b???ng c??ch v??o trang ri??ng c???a m???t b??? b???t k???.</Alert>}
                    <ListDragAndDrop titles={values.titles} handleDragEnd={handleDragEnd} handleRemoveButtonClick={handleRemoveButtonClick} />

                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 2 }}>
                        <CardHeader title="T??m ki???m trong th?? vi???n" />
                        <CardContent>
                            <TitleSearch handleAddButtonClick={handleAddButtonClick} />
                        </CardContent>
                    </Card>
                    <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={isSubmitting}>L??u l???i</LoadingButton>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
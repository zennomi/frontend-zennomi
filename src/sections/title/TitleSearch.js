import { useState, } from 'react';
// @mui
import { TextField, Card, Typography, TableCell, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
// components
import Image from '../../components/Image';
// utils
import axiosInstance from '../../utils/axios';

const columns = [
    {
        field: 'name',
        headerName: 'Tên',
        width: 500,
        renderCell: (params) => (
            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <Card sx={{ borderRadius: 1, mr: 2, width: 64 }}>
                    <Image
                        disabledEffect
                        alt={params.name}
                        src={params.getValue(params.id, 'coverArt')[0]}
                        ratio='4/6'
                    />
                </Card>
                <Typography variant="subtitle2" noWrap>
                    {params.value}
                </Typography>
            </TableCell>
        )
    },
    {
        field: 'type',
        headerName: 'Loại',
        width: 90,
    },
];

export default function TitleSearch({ handleAddButtonClick }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selections, setSelections] = useState([]);
    const handleChange = (event) => {
        setQuery(event.target.value);
    }

    const handleSearchButtonClick = async () => {
        const { data: { results } } = await axiosInstance({
            url: '/v1/titles',
            method: 'get',
            params: { query }
        })
        setResults(results);
    }

    return (
        <Stack spacing={1}>
            <TextField
                fullWidth
                onChange={handleChange}
            />
            <LoadingButton
                variant='contained'
                onClick={handleSearchButtonClick}
            >
                Tìm
            </LoadingButton>
            <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={results}
                    columns={columns}
                    pageSize={25}
                    checkboxSelection
                    hideFooterPagination
                    onSelectionModelChange={(newSelection) => {
                        setSelections(results.filter(t => newSelection.includes(t._id)));
                    }}
                />
            </div>
            <LoadingButton
                variant='contained'
                onClick={() => { handleAddButtonClick(selections) }}
            >
                Thêm vào bộ sưu tập
            </LoadingButton>
        </Stack>
    );
}

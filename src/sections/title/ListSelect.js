// @mui
import { Divider, Paper, MenuList, Menu, MenuItem, ListItemText, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function ListSelect({ titleId,anchorEl,open,handleClose }) {
    return (
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuList>
                    <MenuItem>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
                    </MenuItem>
                </MenuList>
            </Menu>
        </Paper>
    )
}
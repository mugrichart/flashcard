
import {TextField, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';

export const MuiCheckbox = ({ checkedValue, label, callback}) => 
        <FormControlLabel 
                    sx={{minWidth: 100}}
                    control={<Checkbox 
                        checked={checkedValue}
                        onChange={callback}
                            /> } 
                    label={label} 
        />


export const MuiAutoComplete = ({options, label, selectedValue, setSelectedValue, nullOption}) => {
        return <Autocomplete
                freeSolo={true}
                forcePopupIcon={true}
                disablePortal
                id="combo-box-demo"
                options={options}
                sx={{ minWidth: 150 }}
                renderInput={(params) => <TextField {...params}  label={label} />}
                value={selectedValue}
                onChange={(e, selectedOption) =>{ setSelectedValue(selectedOption || nullOption)}} 
        />
}

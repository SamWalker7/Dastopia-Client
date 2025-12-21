import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

const PhoneMuiInput = React.forwardRef(function PhoneMuiInput(
    { label, error, helperText, ...props },
    ref
) {
    return (
        <FormControl fullWidth margin="normal" error={error}>
            <InputLabel shrink>{label}</InputLabel>

            <OutlinedInput
                {...props}
                inputRef={ref}    
                label={label}
            />

            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
});

export default PhoneMuiInput;

import * as React from "react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Snackbar, Alert} from "@mui/material";

interface Props {
    errorMessage: string
}

const CustomizedSnackbars = forwardRef(({errorMessage}: Props, ref) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    useImperativeHandle(ref, () => ({
        handleOpen: () => handleClick(),
    }));
    return (
        <div>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
})

export default CustomizedSnackbars;
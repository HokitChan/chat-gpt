import * as React from "react";
import {forwardRef, useImperativeHandle, useState} from "react";
import {Snackbar, Alert} from "@mui/material";

interface Props {
    errorMessage: string
}

const CustomizedSnackbars = forwardRef(({errorMessage}: Props, ref) => {
    //错误提示状态
    const [open, setOpen] = useState(false);

    //打开错误提示
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    //暴露给父组件打开的方法
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
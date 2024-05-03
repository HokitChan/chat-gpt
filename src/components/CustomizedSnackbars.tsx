import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {useEffect, useState} from "react";

interface Props {
    errorMessage: string
}

function CustomizedSnackbars({errorMessage}: Props) {
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
    useEffect(() => {
        if (errorMessage) {
            handleClick(); // 接收到新的 errorMessage 时打开 Snackbar
        }
    }, [errorMessage]); // 监听 errorMessage 的变化

    return (
        <div>
            <Snackbar anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }} open={open} autoHideDuration={6000} onClose={handleClose}>
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
}

export default CustomizedSnackbars;
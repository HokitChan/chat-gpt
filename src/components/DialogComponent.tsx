import {useState, Fragment} from 'react';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import React from "react";

interface Props {
    onKeyChange: (value: string) => void,
}

export default function DialogComponent({onKeyChange}: Props) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const key = formJson.key;
                        console.log(key);
                        onKeyChange(key);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>ChatGpt</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        请输入你的OpenRouter API key，点击确认即可提交。 <br/>（如需使用我提供的默认key，点取消即可）
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="key"
                        name="key"
                        label="OpenRouter API key"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button type="submit">确认</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
// FullWidthTextField.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";
import {useState, forwardRef, useImperativeHandle} from 'react';

interface Props {
    onValueChange: (value: string) => void,
    isTyping: boolean,
}

const FullWidthTextField = forwardRef(({onValueChange, isTyping}: Props, ref) => {

    const [state, setState] = useState<boolean>(true);
    const [value, setValue] = useState<string>('');

    const handleClick = () => {
        console.log('子组件传送：' + value);
        onValueChange(value);
        setState(true);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setState(e.target.value === '');
        setValue(e.target.value);
    };

    useImperativeHandle(ref, () => ({
        clearValue: () => setValue(''),
        setBtnState: (value: boolean) => setState(value),
    }));

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: '670px',
            }}
        >
            <div className="position-relative">
                <TextField
                    fullWidth
                    placeholder="Message ChatGPT…"
                    id="fullWidth"
                    disabled={isTyping}
                    value={value}
                    onChange={handleInput}
                    sx={textFieldStyles}
                />
                <Button
                    disabled={state || isTyping}
                    onClick={handleClick}
                    variant="contained"
                    sx={buttonStyles}
                >
                    {isTyping ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="h-2 w-2 text-token-text-primary" height="16" width="16">
                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"
                                  strokeWidth="0"></path>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    )}
                </Button>
            </div>
        </Box>
    );
});

const textFieldStyles = {
    width: "100%",
    maxWidth: "670px",
    height: "52px",
    borderRadius: "16px",
    ".MuiInputBase-root": {
        borderRadius: "16px",
    },
    "input": {
        height: "24px",
        lineHeight: "24px",
        padding: "14px 48px 14px 24px",
        borderRadius: "16px",
    },
    ".MuiOutlinedInput-notchedOutline": {
        borderColor: "#bfbfbf!important",
    }
};

const buttonStyles = {
    width: "30px",
    minWidth: "30px",
    height: "30px",
    position: "absolute",
    top: "11px",
    right: "12px",
    padding: "0",
    borderRadius: "8px",
    backgroundColor: "rgb(0 0 0)",
    "&:hover": {
        backgroundColor: "rgb(0 0 0)",
    },
    "&:disabled": {
        backgroundColor: "rgb(229 229 229)",
    }
};

export default FullWidthTextField;

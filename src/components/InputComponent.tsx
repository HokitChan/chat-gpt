import {useState, forwardRef, useImperativeHandle, ChangeEvent, KeyboardEvent} from 'react';
import {Button, TextField, Box} from "@mui/material";

interface Props {
    onValueChange: (value: string) => void,
    isSending: boolean,
}

const InputComponent = forwardRef(({onValueChange, isSending}: Props, ref) => {
    // 输入框的值
    const [value, setValue] = useState<string>('');

    // 处理按钮点击事件
    const handleClick = () => {
        onValueChange(value);
    };

    //接收输入框的值
    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setValue(e.target.value);
    };

    // 暴露给父组件的清空方法
    useImperativeHandle(ref, () => ({
        clearValue: () => setValue(''),
    }));

    //绑定回车键
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        // 检查按下的键是否为回车键（键码为13）
        if (event.key === 'Enter') {
            // 阻止默认行为，避免触发表单的默认提交行为
            event.preventDefault();
            // 执行按钮点击事件
            handleClick();
        }
    }
    return (
        <div className="bottom-bar">
            <Box>
                <TextField
                    fullWidth
                    placeholder="Message ChatGPT…"
                    id="fullWidth"
                    disabled={isSending}
                    value={value}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    sx={textFieldStyles}
                />
                <Button
                    disabled={!value || isSending}
                    onClick={handleClick}
                    variant="contained"
                    sx={buttonStyles}
                >
                    {isSending ? (
                        <svg stroke="white" fill="none" viewBox="0 0 24 24"
                             className="animate-spin text-center" height="16" width="16"
                             xmlns="http://www.w3.org/2000/svg">
                            <line x1="12" y1="2" x2="12" y2="6"></line>
                            <line x1="12" y1="18" x2="12" y2="22"></line>
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                            <line x1="2" y1="12" x2="6" y2="12"></line>
                            <line x1="18" y1="12" x2="22" y2="12"></line>
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2"
                                  strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    )}
                </Button>
            </Box>
        </div>
    );
});
//样式
const textFieldStyles = {
    width: "100%",
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

export default InputComponent;

import {useState, useRef, useEffect} from 'react';
import './App.css';
import InputComponent from "./components/InputComponent";
import {MessageInterFace} from "./types/data"
import ContentComponent from "./components/ContentComponent"
import DialogComponent from "./components/DialogComponent";
import CustomizedSnackbars from "./components/CustomizedSnackbars"
import Grid from '@mui/material/Grid';

function App() {
    // 默认的apiKey
    const defaultKey = "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"
    // 是否正在发送请求
    const [isSending, setSending] = useState<boolean>(false);
    // apiKey
    const [apiKey, setApiKey] = useState(defaultKey);
    // 对话内容
    const [messages, setMessages] = useState<MessageInterFace[]>([]);
    // 错误提示
    const [errorMessage, setErrorMessage] = useState("")

    // 错误提示的ref
    const snackbarsRef = useRef<any>(null);
    const openToast = (message: string) => {
        setErrorMessage(message)
        snackbarsRef.current?.handleOpen();
    }

    //清空输入框
    const childRef = useRef<any>(null);
    const clearChildData = () => {
        childRef.current?.clearValue();
    };

    //发起请求
    const fetchData = (value: string) => {
        const params: MessageInterFace[] = JSON.parse(JSON.stringify(messages))
        params.push({
            role: "user",
            content: value,
            id: Date.now()
        })
        setMessages(params)
        const messagesWithoutId: MessageInterFace[] = params.map(message => {
            const {id, ...rest} = message;
            return rest;
        });
        setSending(true)
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: messagesWithoutId
            })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (!data.error) {
                    clearChildData()
                    params.push({...data.choices[0].message, id: data.id})
                    setMessages(params)
                } else {
                    const err = data?.error?.message
                    console.error(err)
                    openToast(err)
                }
            })
            .catch(error => {
                openToast("请求失败,请检查网络连接！")
                console.error('There was an error!', error);
            })
            .finally(() => {
                setSending(false)
            });
    };

    // 接收输入框传递的值
    const handleValueFromChild = (value: string) => {
        fetchData(value);
    };

    //接收弹窗的api
    const handleKeyChange = (value: string) => {
        setApiKey(value)
    }

    // 获取父元素宽度
    const [parentWidth, setParentWidth] = useState(0);

    useEffect(() => {
        // 获取父元素宽度
        const parentElement = document.querySelector('.wrap') as HTMLElement;
        if (parentElement) {
            setParentWidth(parentElement.offsetWidth);
        }

        // 添加窗口大小变化监听器
        const handleResize = () => {
            const updatedWidth = parentElement.offsetWidth;
            setParentWidth(updatedWidth);
        };

        window.addEventListener('resize', handleResize);

        // 组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <Grid container>
            <Grid item xs></Grid>
            <Grid item xs={8}>
                <div className="wrap flex-column">
                    {/*显示对话的子组件*/}
                    <ContentComponent
                        messages={messages}/>

                    {/*输入框*/}
                    <InputComponent
                        ref={childRef}
                        parentWidth={parentWidth}
                        onValueChange={handleValueFromChild}
                        isSending={isSending}/>

                    {/*输入api弹窗*/}
                    <DialogComponent
                        onKeyChange={handleKeyChange}/>

                    {/*错误提示组件*/}
                    <CustomizedSnackbars
                        ref={snackbarsRef}
                        errorMessage={errorMessage}/>
                </div>
            </Grid>
            <Grid item xs></Grid>
        </Grid>
    );
}

export default App;

import {useState, useRef} from 'react';
import './App.css';
import InputComponent from "./components/InputComponent";
import {MessageInterFace} from "./types/data"
import ContentComponent from "./components/ContentComponent"
import DialogComponent from "./components/DialogComponent";
import CustomizedSnackbars from "./components/CustomizedSnackbars"

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
                console.log(response);
                if (!response.ok) {
                    openToast("请求失败")
                    throw new Error('请求失败');
                }
                setMessages(params)
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (!data.error) {
                    clearChildData()
                    params.push({...data.choices[0].message, id: data.id})
                    setMessages(params)
                } else {
                    console.error(JSON.parse(data.error.message));
                    openToast(JSON.parse(data.error.message).error.message)
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

    return (
        <div className="wrap flex-column">
            {/*显示对话的子组件*/}
            <ContentComponent
                messages={messages}/>

            {/*输入框*/}
            <InputComponent
                ref={childRef}
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
    );
}

export default App;

import {useState, useRef} from 'react';
import './App.css';
import InputComponent from "./components/InputComponent";
import {MessageInterFace} from "./types/data"
import ContentComponent from "./components/ContentComponent"
import DialogComponent from "./components/DialogComponent";
import CustomizedSnackbars from "./components/CustomizedSnackbars"
import * as React from 'react';

function App() {
    const defaultKey = "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"
    const [isSending, setSending] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState(defaultKey);
    const [messages, setMessages] = useState<MessageInterFace[]>([]);
    const [errorMessage, setErrorMessage] = useState("")
    const childRef = useRef<any>(null);
    const snackbarsRef = useRef<any>(null);
    const clearChildData = () => {
        // 调用子组件暴露的 clearValue 方法
        if (childRef.current) {
            childRef.current.clearValue();
        }
    };
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

    const openToast = (message: string) => {
        if (snackbarsRef.current) {
            setErrorMessage(message)
            snackbarsRef.current.handleOpen();
        }
    }
    const handleValueFromChild = (value: string) => {
        fetchData(value);
    };

    const handleKeyChange = (value: string) => {
        setApiKey(value)
    }

    return (
        <div className="wrap flex-column">
            <ContentComponent
                messages={messages}/>
            <InputComponent
                ref={childRef}
                onValueChange={handleValueFromChild}
                isSending={isSending}/>
            <DialogComponent
                onKeyChange={handleKeyChange}/>
            <CustomizedSnackbars
                ref={snackbarsRef}
                errorMessage={errorMessage}/>
        </div>
    );
}

export default App;

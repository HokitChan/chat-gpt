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
    const [isTyping, setTyping] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState(defaultKey);
    const [messages, setMessages] = useState<MessageInterFace[]>([]);
    const [errorMessage, setErrorMessage] = useState("")
    const getParams = (value: string) => {
        const params: MessageInterFace[] = messages
        params.push({
            role: "user",
            content: value,
            id: Date.now()
        })
        setMessages(params)
    }
    const childRef = useRef<any>(null);
    const clearChildData = () => {
        // 调用子组件暴露的 clearValue 方法
        if (childRef.current) {
            childRef.current.clearValue();
        }
    };
    const setBtnState = (value: boolean) => {
        // 调用子组件暴露的 setBtnState 方法
        if (childRef.current) {
            childRef.current.setBtnState(value);
        }
    };
    const fetchData = () => {
        const messagesWithoutId: MessageInterFace[] = messages.map(message => {
            const {id, ...rest} = message;
            return rest;
        });
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
                    setBtnState(false)
                    setErrorMessage("请求失败")
                    throw new Error('请求失败');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                const params = messages
                if (!data.error) {//Todo
                    setBtnState(false)
                    clearChildData()
                    params.push({...data.choices[0].message, id: data.id})
                    setMessages(params)
                } else {
                    console.log(JSON.parse(data.error.message));
                    setErrorMessage(JSON.parse(data.error.message).error.message)
                    setBtnState(false)
                    /*           params.push({
                                   role: "assistant",
                                   content: JSON.parse(data.error.message).error.message,
                                   id: Date.now()
                               })*/
                }
            })
            .catch(error => {
                setBtnState(false)
                setErrorMessage("请求失败,请检查网络连接！")
                console.error('There was an error!', error);
                // 处理请求失败的逻辑
            })
            .finally(() => {
                setTyping(false)
            });
    };

    const handleValueFromChild = (value: string) => {
        getParams(value)
        setTyping(true)
        fetchData();
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
                isTyping={isTyping}/>
            <DialogComponent
                onKeyChange={handleKeyChange}/>
            <CustomizedSnackbars
                errorMessage={errorMessage}/>
        </div>
    );
}

export default App;

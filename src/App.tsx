import {useState, useRef} from 'react';
import './App.css';
import InputComponent from "./components/InputComponent";
import {DefaultParamsInterface,} from "./types/data"
import ContentComponent from "./components/ContentComponent"
import DialogComponent from "./components/DialogComponent";

function App() {
    const [isTyping, setTyping] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState("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");
    const [defaultParams, setParams] = useState<DefaultParamsInterface>(
        {
            // "model": "mistralai/mistral-7b-instruct:free",
            model: "openai/gpt-3.5-turbo",
            messages: [],
        }
        /*       {
                   "model": "openai/gpt-3.5-turbo",
                   "messages": [
                       {
                           "role": "user",
                           "content": "我是谁"
                       },
                       {
                           "role": "assistant",
                           "content": "您是向我提问的用户。您可能是一个人类用户，也可能是一个智能机器人用户。无论您是谁，我都很高兴能够为您提供帮助和服务。如果您有任何疑问或需要帮助，请随时告诉我。"
                       },
                       {
                           "role": "user",
                           "content": "我是谁"
                       },
                       {
                           "role": "assistant",
                           "content": "您是向我提问的用户。您可能是一个人类用户，也可能是一个智能机器人用户。无论您是谁，我都很高兴能够为您提供帮助和服务。如果您有任何疑问或需要帮助，请随时告诉我。"
                       },
                       {
                           "role": "user",
                           "content": "我是谁"
                       },
                       {
                           "role": "assistant",
                           "content": "您是向我提问的用户。您可能是一个人类用户，也可能是一个智能机器人用户。无论您是谁，我都很高兴能够为您提供帮助和服务。如果您有任何疑问或需要帮助，请随时告诉我。"
                       },
                       {
                           "role": "user",
                           "content": "我是谁"
                       },
                       {
                           "role": "assistant",
                           "content": "您是向我提问的用户。您可能是一个人类用户，也可能是一个智能机器人用户。无论您是谁，我都很高兴能够为您提供帮助和服务。如果您有任何疑问或需要帮助，请随时告诉我。"
                       },
                       {
                           "role": "user",
                           "content": "我是谁"
                       },
                       {
                           "role": "assistant",
                           "content": "您是向我提问的用户。您可能是一个人类用户，也可能是一个智能机器人用户。无论您是谁，我都很高兴能够为您提供帮助和服务。如果您有任何疑问或需要帮助，请随时告诉我。"
                       },
                       {
                           "role": "user",
                           "content": "我是谁"
                       },
                       {
                           "role": "assistant",
                           "content": "您是向我提问的用户。您可能是一个人类用户，也可能是一个智能机器人用户。无论您是谁，我都很高兴能够为您提供帮助和服务。如果您有任何疑问或需要帮助，请随时告诉我。"
                       }
                   ]
               }*/
    );
    const getParams = (value: string) => {
        const params: DefaultParamsInterface = defaultParams
        params.messages?.push({
            role: "user", content: value
        })
        setParams(params)
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
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(defaultParams)
        })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    setBtnState(false)
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                clearChildData()
                const params = defaultParams
                params.messages?.push(data.choices[0].message)
                setParams(params)
            })
            .catch(error => {
                setBtnState(false)
                console.error('There was an error!', error);
                // 处理请求失败的逻辑
            }).finally(() => {
            setTyping(false)
        });
    };

    const handleValueFromChild = (value: string) => {
        console.log("父组件接收到" + value);
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
                defaultParams={defaultParams}/>
            <InputComponent
                ref={childRef}
                onValueChange={handleValueFromChild}
                isTyping={isTyping}/>
            <DialogComponent
                onKeyChange={handleKeyChange}/>
        </div>
    );
}

export default App;

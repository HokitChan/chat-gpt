import {useState, Fragment, useRef} from 'react';
import './App.css';
import FullWidthTextField from "./components/FullWidthTextField";
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface Choice {
    message: {
        content: string;
    };
}

interface ResponseData {
    choices?: Choice[];
}

function App() {
    const [state, setState] = useState<ResponseData>({choices: []});
    const [isTyping, setTyping] = useState<boolean>(false);

    const childRef = useRef<any>(null);
    const clearChildData = () => {
        // 调用子组件暴露的 clearValue 方法
        if (childRef.current) {
            childRef.current.clearValue();
        }
    };
    const setBtnState = (value:boolean) => {
        // 调用子组件暴露的 setBtnState 方法
        if (childRef.current) {
            childRef.current.setBtnState(value);
        }
    };

    const handleValueFromChild = (value: string) => {
        console.log("父组件接收到" + value);
        setTyping(true)
        fetchData();
        // 处理值变更的逻辑
    };

    const fetchData = () => {
        const params = {
            // "model": "mistralai/mistral-7b-instruct:free",
            model: "openai/gpt-3.5-turbo",
            messages: [{role: "user", content: "生命的意义是什么?"}],
        };
        let OPENROUTER_API_KEY = "";
        // const OPENROUTER_API_KEY = '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';
        // const OPENROUTER_API_KEY = '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';
        // const OPENROUTER_API_KEY = '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';

        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
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
                setState(data);
            })
            .catch(error => {
                setBtnState(false)
                console.error('There was an error!', error);
                // 处理请求失败的逻辑
            }).finally(() => {
            setTyping(false)
        });
    };

    const list = state.choices?.map((item, index) => (
        <Fragment key={index}>
            <li>{item.message.content}</li>
        </Fragment>)
    );
    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container>
                <Grid item xs/>
                <Grid item xs={8}>
                    <Item>
                        <ul>{list}</ul>

                        <FullWidthTextField ref={childRef} onValueChange={handleValueFromChild} isTyping={isTyping}/>
                    </Item>
                </Grid>
                <Grid item xs/>
            </Grid>
        </Box>
    );
}

export default App;

import { IconButton, InputAdornment, TextField } from "@mui/material"
import { chatBotServices } from "./services/ChatBotServices"
import { useEffect, useRef, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Chat{
    question:string,
    answer:string
}

export const ChatBotChat = () =>{
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState('')
    const [chat, setChat] = useState<Chat[]>([])
    const [isAnswerLoading, setIsAnswerLoading] = useState(false)

    useEffect(()=>{
        setChat(JSON.parse(localStorage.getItem('chat') ?? "[]"))
    },[])

    useEffect(() => {
        if (!chatContainerRef.current) return;

        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
    }, [chat]);

    const sendPrompt = async () =>{
        if(isAnswerLoading) return
        setChat(prev=>([...prev, {question:prompt, answer:'...'}]))
        setIsAnswerLoading(true)
        await chatBotServices.sendPrompt(prompt, chat).then(async res=>{
            await readAnswer(res)
        }).finally(()=>{
            setIsAnswerLoading(false)
            setPrompt('')
        })
    }

    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

        const readAnswer = async (response:any) =>{
        const reader = response.body!.getReader();

        const decoder = new TextDecoder();

        let answer = "";
        while (true) {

            const { done, value } = await reader.read();

            if (done)
                break;

            const chunk = decoder.decode(value);
            answer = answer + chunk
            setChat(prev => {
                const updated = [...prev];

                const last = updated[updated.length - 1];

                updated[updated.length - 1] = {
                    ...last,
                    answer
                };

                return updated;
            });

            await sleep(30);
        }
        localStorage.setItem('chat', JSON.stringify(chat))
    }

    return(
        <div
            style={{
                width:'300px',
                height:'500px',
                borderWidth:'1px',
                borderStyle:'solid',
                borderColor:'lightgrey',
                borderRadius:'10px',
                display:'flex',
                flexDirection:'column',
            }}
        >
            <div
                style={{
                    height:'10%'
                }}
            >

            </div>
            <div
                ref={chatContainerRef}
                style={{
                    borderTopWidth:'1px',
                    borderTopStyle:'solid',
                    borderTopColor:'lightgrey',
                    height:'70%', overflowY: "auto",
                }}
            >
                {
                    chat.map(item=>(
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <div style={{
                                width:'65%',
                                alignSelf:'flex-end',
                                backgroundColor:'lightblue',
                                margin:'10px',
                                padding:'10px',
                                borderRadius:'10px 0px 10px 10px'
                            }}>
                                {item.question}
                            </div>
                            <div style={{
                                width:'65%',
                                alignSelf:'start-end',
                                backgroundColor:'lightblue',
                                margin:'10px',
                                padding:'10px',
                                borderRadius:'0px 10px 10px 10px'
                            }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {item.answer}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))
                }
            </div>
            <TextField
                fullWidth
                value={prompt}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    sendPrompt();
                    }
                }}
                onChange={(e)=>{
                    setPrompt(e.target.value)
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        paddingRight: "45px",
                    },
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end" >
                                <IconButton 
                                    onClick={sendPrompt}
                                    sx={{
                                        position: "absolute",
                                        right: 8,
                                        bottom: 8,
                                    }}
                                >
                                    {isAnswerLoading ?
                                        <CircularProgress/> :
                                        <SendIcon color="info"/>
                                    }
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                multiline
                minRows={3}
                maxRows={3}
            />
        </div>
    )
}
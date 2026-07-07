import { IconButton, InputAdornment, TextField } from "@mui/material"
import { chatBotServices } from "./services/ChatBotServices"
import { useContext, useEffect, useRef, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatContext } from "./ChatContext";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

export interface Chat{
    question:string,
    answer:string
}

export const ChatBotChat = () =>{
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const chatComponent = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState('')
    const [chat, setChat] = useState<Chat[]>([])
    const [isAnswerLoading, setIsAnswerLoading] = useState(false)
    const context = useContext(ChatContext)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const fullWidth = 600
    const fullHeight = 700
    useEffect(()=>{
        setChat(JSON.parse(localStorage.getItem('chat') ?? "[]"))
    },[])

    useEffect(()=>{
        if(isFullScreen){
            context?.setPosition({x:window.innerWidth / 2 - fullWidth / 2, y:window.innerHeight / 2 - fullHeight / 2})
        }
    },[isFullScreen])

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

    useEffect(()=>{
        if(chat.length)
            localStorage.setItem('chat', JSON.stringify(chat))
    },[chat])

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
    }

    const deleteChat = () =>{
        setChat([])
        localStorage.removeItem('chat')
    }

    return(
        <div
            id='chat'
            ref={chatComponent}
            style={{
                width:isFullScreen ? `${fullWidth}px` :'300px',
                height:isFullScreen ? `${fullHeight}px` :'500px',
                borderWidth:'1px',
                borderStyle:'solid',
                borderColor:'lightgrey',
                borderRadius:'10px',
                display:'flex',
                flexDirection:'column',
                position: "fixed",
                left: context?.position?.x,
                top: context?.position?.y,
            }}
        >
            <div
                onPointerDown={context?.onPointerDownFunc}
                style={{
                    cursor:'grab',
                    height:'10%',
                    display:'flex',
                    flexDirection:'row',
                    borderRadius:'10px 10px 0px 0px',
                    justifyContent:'flex-end',
                    alignItems:'center',
                    paddingRight:'10px',
                    backgroundColor:'#6cad6c',
                    fontWeight:'bolder'
                }}
            >   
                
                
                <IconButton onClick={deleteChat}>
                    <DeleteSweepIcon color="action" fontSize="medium"/>
                </IconButton>
                <IconButton onClick={()=>context?.setIsButton(prev=>!prev)}>
                    <RemoveIcon color="action"/>
                </IconButton>
                <IconButton onClick={()=>setIsFullScreen(prev=>!prev)}>
                    {  
                        !isFullScreen ? 
                        <OpenInFullIcon color="action" />:
                        <CloseFullscreenIcon color="action"/>
                    }
                </IconButton>
            </div>
            <div
                ref={chatContainerRef}
                style={{
                    borderTopWidth:'1px',
                    borderTopStyle:'solid',
                    borderTopColor:'lightgrey',
                    backgroundColor:'#c8f3cb',
                    height:'70%', overflowY: "auto",
                }}
            >
                {
                    !chat.length ?
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:'bolder', height:'50%', color:'grey'}}>
                        {'Estoy acá para ayudarte'}
                    </div>:
                    chat.map((item, index)=>(
                        <div key={index} style={{display:'flex', flexDirection:'column'}}>
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
                                borderRadius:'0px 10px 10px 10px',
                                overflowWrap: "break-word",
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
                placeholder="Escribe tu pregunta..."
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
                        "&.Mui-focused fieldset": {
                            borderColor:'#6cad6c',
                        }
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
                                        <SendIcon style={{color:'#6cad6c'}}/>
                                    }
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                multiline
                minRows={isFullScreen ? 5 : 3}
                maxRows={isFullScreen ? 5 : 3}
            />
        </div>
    )
}
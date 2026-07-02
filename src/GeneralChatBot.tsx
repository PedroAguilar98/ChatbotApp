import { useEffect, useState } from "react"
import { ChatBotButton } from "./ChatBotButton"
import { ChatBotChat } from "./ChatBotChat"
import { ChatProvider } from "./ChatContext"

export const GeneralChatBot = () =>{
    const [isButton, setIsButton] = useState(true)
    
    return(
        <ChatProvider>
            <div
                onClick={()=>setIsButton(false)}
            >
            {
                isButton ?
                    <ChatBotButton/>
                :
                    <ChatBotChat/>
            }
            </div>
        </ChatProvider>
    )
    
}
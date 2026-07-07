import { useContext } from "react"
import { ChatBotButton } from "./ChatBotButton"
import { ChatBotChat } from "./ChatBotChat"
import { ChatContext, ChatProvider } from "./ChatContext"

const ChatBotMode = () =>{
    const context = useContext(ChatContext)
    return(
         <div
            >
            {
                context?.isButton ?
                    <ChatBotButton/>
                :
                    <ChatBotChat />
            }
        </div>
    )
}

export const GeneralChatBot = () =>{
    
    
    return(
        <ChatProvider>
           <ChatBotMode/>
        </ChatProvider>
    )
    
}
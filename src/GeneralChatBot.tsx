import { useContext, useEffect, useState } from "react"
import { ChatBotButton } from "./ChatBotButton"
import { ChatBotChat } from "./ChatBotChat"
import { ChatContext, ChatProvider } from "./ChatContext"
import { settingsServices } from "./services/SettingsService"

const ChatBotMode = () =>{
    const context = useContext(ChatContext)

    const [color, setColor] = useState("#1976d2");
    const [secondaryColor, setSecondaryColor] = useState("#1976d2");
    const [chatName, setChatName] = useState("PepeBot");
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [bodyColor, setBodyColor] = useState("#667085");
    const [iconSrc, setIconSrc] = useState<string | null>(null);
    const [backgroundChatColor, setbackGroundChatColor] = useState('')
    const [defaultMessage, setDefaultMessage] = useState('')

    const getSettings = async () => {
        await settingsServices.getSettings(1).then(data=>{
            if(data.tenant?.settings){
                setColor(data.tenant?.settings.color);
                setSecondaryColor(data.tenant?.settings.secondaryColor);
                setChatName(data.tenant?.settings.chatName);
                setTitleColor(data.tenant?.settings.titleColor);
                setBodyColor(data.tenant?.settings.bodyColor);
                setIconSrc(data.tenant?.settings?.iconSrc);
                setbackGroundChatColor(data.tenant?.settings?.backgroundChatColor)
                setDefaultMessage(data.tenant?.settings?.defaultMessage)
            }
        })
    }

    useEffect(()=>{
        getSettings()
    },[])

    return(
         <div
            >
            {
                context?.isButton ?
                    <ChatBotButton 
                        color={color} 
                        chatName={chatName} 
                        titleColor={titleColor} 
                        iconSrc={iconSrc} 
                    />
                :
                    <ChatBotChat 
                        color={color} 
                        chatName={chatName} 
                        titleColor={titleColor} 
                        iconSrc={iconSrc}  
                        secondaryColor={secondaryColor} 
                        bodyColor={bodyColor}
                        backgroundChatColor={backgroundChatColor}
                        defaultMessage={defaultMessage}
                    />
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
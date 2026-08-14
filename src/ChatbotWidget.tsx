import { useContext, useEffect, useState } from "react"
import { ChatBotButton } from "./ChatBotButton"
import { ChatBotChat } from "./ChatBotChat"
import { ChatContext, ChatProvider } from "./ChatContext"
import { ChatbotConfigProvider } from "./config/ChatbotConfigContext"
import { useChatbotConfig, useSettingsService } from "./config/useChatbotConfig"
import type { ChatbotConfig } from "./config/ChatbotConfig"

const ChatBotMode = () => {
    const context = useContext(ChatContext)
    const config = useChatbotConfig()
    const settingsService = useSettingsService()
    const theme = config.theme

    const [color, setColor] = useState(theme?.color ?? "#1976d2");
    const [secondaryColor, setSecondaryColor] = useState(theme?.secondaryColor ?? "#1976d2");
    const [chatName, setChatName] = useState(theme?.chatName ?? "PepeBot");
    const [titleColor, setTitleColor] = useState(theme?.titleColor ?? "#ffffff");
    const [bodyColor, setBodyColor] = useState(theme?.bodyColor ?? "#667085");
    const [iconSrc, setIconSrc] = useState<string | null>(theme?.iconSrc ?? null);
    const [backgroundChatColor, setbackGroundChatColor] = useState(theme?.backgroundChatColor ?? '')
    const [defaultMessage, setDefaultMessage] = useState(theme?.defaultMessage ?? '')

    const getSettings = async () => {
        try {
            const data = await settingsService.getSettings(config.tenantId)
            const settings = data.tenant?.settings
            if (settings) {
                // A field explicitly set in config.theme wins over whatever the backend returns.
                if (!theme?.color) setColor(settings.color);
                if (!theme?.secondaryColor) setSecondaryColor(settings.secondaryColor);
                if (!theme?.chatName) setChatName(settings.chatName);
                if (!theme?.titleColor) setTitleColor(settings.titleColor);
                if (!theme?.bodyColor) setBodyColor(settings.bodyColor);
                if (!theme?.iconSrc) setIconSrc(settings.iconSrc);
                if (!theme?.backgroundChatColor) setbackGroundChatColor(settings.backgroundChatColor);
                if (!theme?.defaultMessage) setDefaultMessage(settings.defaultMessage);
            }
        } catch (error) {
            config.onError?.(error, "getSettings")
        }
    }

    useEffect(() => {
        getSettings()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
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

export const ChatbotWidget = ({ config }: { config: ChatbotConfig }) => {
    return (
        <ChatbotConfigProvider config={config}>
            <ChatProvider>
                <ChatBotMode />
            </ChatProvider>
        </ChatbotConfigProvider>
    )
}

import { createContext, useMemo, type ReactNode } from "react";
import type { ChatbotConfig } from "./ChatbotConfig";
import { createChatBotService, type ChatBotService } from "../services/ChatBotServices";
import { createSettingsService, type SettingsService } from "../services/SettingsService";

export interface ChatbotConfigContextValue {
    config: ChatbotConfig;
    chatBotService: ChatBotService;
    settingsService: SettingsService;
}

export const ChatbotConfigContext = createContext<ChatbotConfigContextValue | null>(null);

export function ChatbotConfigProvider({ config, children }: { config: ChatbotConfig; children: ReactNode }) {
    const value = useMemo<ChatbotConfigContextValue>(() => ({
        config,
        chatBotService: createChatBotService(config),
        settingsService: createSettingsService(config),
    }), [config]);

    return (
        <ChatbotConfigContext.Provider value={value}>
            {children}
        </ChatbotConfigContext.Provider>
    );
}

import { useContext } from "react";
import { ChatbotConfigContext, type ChatbotConfigContextValue } from "./ChatbotConfigContext";
import type { ChatbotConfig } from "./ChatbotConfig";
import type { ChatBotService } from "../services/ChatBotServices";
import type { SettingsService } from "../services/SettingsService";

function useChatbotConfigContext(): ChatbotConfigContextValue {
    const context = useContext(ChatbotConfigContext);
    if (!context) {
        throw new Error("useChatbotConfig* hooks must be used within a ChatbotConfigProvider");
    }
    return context;
}

export function useChatbotConfig(): ChatbotConfig {
    return useChatbotConfigContext().config;
}

export function useChatBotService(): ChatBotService {
    return useChatbotConfigContext().chatBotService;
}

export function useSettingsService(): SettingsService {
    return useChatbotConfigContext().settingsService;
}

import type { Chat } from "../ChatBotChat";
import type { ChatbotConfig } from "../config/ChatbotConfig";
import { buildHeaders } from "./httpClient";

export function createChatBotService(config: ChatbotConfig) {
    return {
        sendPrompt: async (prompt: string, prevChat: Chat[]) => {
            const headers = await buildHeaders(config);
            const response = await fetch(`${config.apiUrl}/chat`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    tenantId: config.tenantId,
                    question: prompt,
                    prevChat,
                }),
            });
            return response;
        },
    };
}

export type ChatBotService = ReturnType<typeof createChatBotService>;

import type { Chat } from "../ChatBotChat";

const apiUrl = import.meta.env.VITE_API_URL;
class ChatBotService {
    sendPrompt = async (prompt:string, prevChat:Chat[]) =>{
        const response = await fetch(`${apiUrl}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tenantId: 1,
                question: prompt,
                prevChat
            }),
        });
        return response
    }
}

export const chatBotServices = new ChatBotService()
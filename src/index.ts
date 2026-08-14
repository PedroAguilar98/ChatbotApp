// Public entry point of the widget. Everything a host application needs to
// embed the chatbot lives behind this file.
export { initChatbot } from "./lib/initChatbot";
export type { ChatbotHandle } from "./lib/initChatbot";
export { ChatbotWidget } from "./ChatbotWidget";
export type { ChatbotConfig, ChatbotTheme, ChatbotHeaders } from "./config/ChatbotConfig";

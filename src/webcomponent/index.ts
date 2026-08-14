import { ChatbotElement } from "./ChatbotElement";

export const CHATBOT_TAG_NAME = "chatbot-widget";

if (!customElements.get(CHATBOT_TAG_NAME)) {
    customElements.define(CHATBOT_TAG_NAME, ChatbotElement);
}

export { ChatbotElement };

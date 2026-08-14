import type { ChatbotConfig } from "../config/ChatbotConfig";
import { initChatbot, type ChatbotHandle } from "../lib/initChatbot";

/**
 * `<chatbot-widget>` custom element — a thin wrapper over `initChatbot` for
 * hosts that aren't React (Vue, Angular, plain HTML/JS).
 *
 * Simple setups can use attributes:
 *   <chatbot-widget api-url="https://api.example.com" tenant-id="42"></chatbot-widget>
 *
 * Anything beyond apiUrl/tenantId (theme, getAuthToken, headers, onError) has
 * to be set from JS, since attributes can only carry strings:
 *   document.querySelector('chatbot-widget').config = { apiUrl, tenantId, getAuthToken: () => token };
 */
export class ChatbotElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["api-url", "tenant-id"];
    }

    private handle: ChatbotHandle | null = null;
    private jsConfig: ChatbotConfig | null = null;

    set config(value: ChatbotConfig) {
        this.jsConfig = value;
        this.remount();
    }

    get config(): ChatbotConfig | null {
        return this.jsConfig;
    }

    connectedCallback(): void {
        this.remount();
    }

    disconnectedCallback(): void {
        this.handle?.destroy();
        this.handle = null;
    }

    attributeChangedCallback(): void {
        if (this.isConnected) {
            this.remount();
        }
    }

    private buildConfigFromAttributes(): ChatbotConfig | null {
        const apiUrl = this.getAttribute("api-url");
        const tenantId = this.getAttribute("tenant-id");
        if (!apiUrl || !tenantId) {
            return null;
        }
        return { apiUrl, tenantId };
    }

    private remount(): void {
        this.handle?.destroy();
        this.handle = null;

        const config = this.jsConfig ?? this.buildConfigFromAttributes();
        if (!config) {
            // Not enough config yet (e.g. attributes not set). Wait for the
            // next attributeChangedCallback/config setter call.
            return;
        }

        this.handle = initChatbot(this, config);
    }
}

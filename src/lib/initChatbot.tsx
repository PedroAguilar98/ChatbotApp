import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import { ChatbotWidget } from "../ChatbotWidget";
import type { ChatbotConfig } from "../config/ChatbotConfig";
import { createShadowMount, type ShadowMount } from "./shadowMount";

export interface ChatbotHandle {
    /** Unmounts the widget and cleans up its listeners. Call before re-initializing the same container. */
    destroy: () => void;
}

/**
 * Public mounting API for embedding the chatbot widget into a host application.
 * The host owns `container` and everything in `config` — this call makes no
 * assumptions about the surrounding app (routing, auth, styling, etc.).
 */
export function initChatbot(container: HTMLElement, config: ChatbotConfig): ChatbotHandle {
    if (!config.apiUrl) {
        throw new Error("initChatbot: config.apiUrl is required");
    }
    if (config.tenantId === undefined || config.tenantId === null || config.tenantId === "") {
        throw new Error("initChatbot: config.tenantId is required");
    }

    const useShadowDom = config.useShadowDom ?? true;
    const shadow: ShadowMount | null = useShadowDom ? createShadowMount(container) : null;
    const mountPoint = shadow?.mountPoint ?? container;

    const root: Root = createRoot(mountPoint);
    const widget = <ChatbotWidget config={config} />;
    root.render(
        <StrictMode>
            {shadow ? <CacheProvider value={shadow.emotionCache}>{widget}</CacheProvider> : widget}
        </StrictMode>,
    );

    return {
        destroy: () => {
            root.unmount();
            shadow?.unmount();
        },
    };
}

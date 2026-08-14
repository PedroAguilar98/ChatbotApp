import createCache, { type EmotionCache } from "@emotion/cache";

export interface ShadowMount {
    /** Where React actually renders — lives inside the shadow root, isolated from the host. */
    mountPoint: HTMLDivElement;
    /** Emotion cache bound to the shadow root, so MUI/Emotion inject their <style> tags there instead of <head>. */
    emotionCache: EmotionCache;
    /** Detaches the shadow host from the DOM. */
    unmount: () => void;
}

/**
 * Creates a Shadow DOM boundary inside `container` so the widget's CSS never
 * leaks into the host page and vice versa. The host element is pinned to the
 * viewport (`position: fixed; inset: 0`) so the widget's own `position: fixed`
 * children keep floating correctly, but `pointer-events: none` on it keeps
 * the rest of the host page clickable — only the widget's own subtree
 * (`mountPoint`) re-enables pointer events.
 */
export function createShadowMount(container: HTMLElement): ShadowMount {
    const hostElement = document.createElement("div");
    hostElement.style.position = "fixed";
    hostElement.style.inset = "0";
    hostElement.style.pointerEvents = "none";
    hostElement.style.zIndex = "2147483000";
    container.appendChild(hostElement);

    const shadowRoot = hostElement.attachShadow({ mode: "open" });

    const emotionContainer = document.createElement("div");
    shadowRoot.appendChild(emotionContainer);

    const mountPoint = document.createElement("div");
    mountPoint.style.pointerEvents = "auto";
    shadowRoot.appendChild(mountPoint);

    const emotionCache = createCache({ key: "chatbot-widget", container: emotionContainer });

    return {
        mountPoint,
        emotionCache,
        unmount: () => {
            hostElement.remove();
        },
    };
}

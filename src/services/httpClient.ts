import type { ChatbotConfig } from "../config/ChatbotConfig";

/**
 * Builds the headers for a request, merging in an auth token and any custom
 * headers the host provided. Doesn't assume a specific auth scheme (Bearer,
 * cookie, API key, ...) — that's entirely up to config.getAuthToken/headers.
 */
export async function buildHeaders(config: ChatbotConfig): Promise<Record<string, string>> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    try {
        const token = await config.getAuthToken?.();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    } catch (error) {
        config.onError?.(error, "getAuthToken");
    }

    const extraHeaders = typeof config.headers === "function"
        ? await config.headers()
        : config.headers;

    return { ...headers, ...extraHeaders };
}

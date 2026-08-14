export interface ChatbotTheme {
    color?: string;
    secondaryColor?: string;
    chatName?: string;
    titleColor?: string;
    bodyColor?: string;
    iconSrc?: string | null;
    backgroundChatColor?: string;
    defaultMessage?: string;
}

export type ChatbotHeaders =
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);

export interface ChatbotConfig {
    /** Base URL of the backend this widget talks to. */
    apiUrl: string;
    /** Identifier of the tenant/instance to load. Owned by the host, not hardcoded. */
    tenantId: string | number;
    /** Optional theme overrides. Any field left unset falls back to what the backend returns for the tenant. */
    theme?: ChatbotTheme;
    /** Namespace used to scope this widget's localStorage keys. Defaults to `tenantId`. */
    storageNamespace?: string;
    /** Called before each request to obtain an auth token, if the host requires one. */
    getAuthToken?: () => string | null | undefined | Promise<string | null | undefined>;
    /** Extra headers merged into every request (static object or a function evaluated per request). */
    headers?: ChatbotHeaders;
    /** Invoked whenever a request/config error happens, instead of failing silently. */
    onError?: (error: unknown, context: string) => void;
    /**
     * Mounts the widget inside a Shadow DOM so the host's CSS can't leak in
     * (and MUI/Emotion's styles can't leak out). Defaults to `true`; set to
     * `false` only if a host integration needs to reach into the widget's DOM.
     */
    useShadowDom?: boolean;
}

export function resolveStorageNamespace(config: ChatbotConfig): string {
    return config.storageNamespace ?? String(config.tenantId);
}

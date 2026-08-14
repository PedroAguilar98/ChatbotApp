import axios from "axios";
import type { ChatbotConfig } from "../config/ChatbotConfig";
import { buildHeaders } from "./httpClient";

export function createSettingsService(config: ChatbotConfig) {
    const client = axios.create({ baseURL: config.apiUrl });

    client.interceptors.request.use(async (requestConfig) => {
        const headers = await buildHeaders(config);
        Object.assign(requestConfig.headers, headers);
        return requestConfig;
    });

    return {
        getSettings: async (id: string | number = config.tenantId) => {
            const response = await client.get(`/tenants/${id}`);
            return response.data;
        },

        editSettings: async (id: string | number, settings: any) => {
            const response = await client.put(`/tenants/${id}`, { settings });
            return response.data;
        },
    };
}

export type SettingsService = ReturnType<typeof createSettingsService>;

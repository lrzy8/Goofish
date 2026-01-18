import { Injectable } from '@angular/core';

export interface AISettings {
    baseUrl: string;
    apiKey: string;
    hasApiKey: boolean;
    model: string;
    systemPrompt: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private readonly autoreplyBaseUrl = '/api/autoreply';
    private readonly statusBaseUrl = '/api/status';

    async getAISettings(): Promise<AISettings> {
        const res = await fetch(`${this.autoreplyBaseUrl}/ai`);
        return res.json();
    }

    async saveAISettings(settings: Partial<AISettings>): Promise<{ success: boolean }> {
        const res = await fetch(`${this.autoreplyBaseUrl}/ai`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        return res.json();
    }

    async testAIConnection(): Promise<{ success: boolean; error?: string }> {
        const res = await fetch(`${this.autoreplyBaseUrl}/ai/test`, { method: 'POST' });
        return res.json();
    }

    async getDefaultPrompt(): Promise<string> {
        const res = await fetch(`${this.autoreplyBaseUrl}/ai/default-prompt`);
        const data = await res.json();
        return data.prompt;
    }
    
    // 获取时间信息
    async getTimeInfo(): Promise<any> {
        const res = await fetch(`${this.statusBaseUrl}/time`);
        return res.json();
    }
    
    // 获取时区设置
    async getTimezone(): Promise<any> {
        const res = await fetch(`${this.statusBaseUrl}/timezone`);
        return res.json();
    }
    
    // 设置时区
    async setTimezone(timezone: string): Promise<any> {
        const res = await fetch(`${this.statusBaseUrl}/timezone`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timezone })
        });
        return res.json();
    }
}

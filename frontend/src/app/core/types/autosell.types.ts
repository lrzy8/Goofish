/**
 * 自动发货相关类型定义
 */

export type DeliveryType = 'fixed' | 'stock' | 'api';
export type TriggerOn = 'paid' | 'confirmed';

export interface ApiConfig {
    url: string;
    method: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: string;
    responseField?: string;
}

export interface AutoSellRule {
    id: number;
    name: string;
    enabled: boolean;
    itemId: string | null;
    accountId: string | null;
    deliveryType: DeliveryType;
    deliveryContent: string | null;
    apiConfig: ApiConfig | null;
    triggerOn: TriggerOn;
    workflowId: number | null;
    stockCount?: number;
    usedCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface StockItem {
    id: number;
    ruleId: number;
    content: string;
    used: boolean;
    usedOrderId: string | null;
    createdAt: string;
    usedAt: string | null;
}

export interface StockStats {
    total: number;
    used: number;
    available: number;
}

export interface DeliveryLog {
    id: number;
    ruleId: number | null;
    orderId: string;
    accountId: string;
    deliveryType: DeliveryType;
    content: string;
    status: 'success' | 'failed';
    errorMessage: string | null;
    createdAt: string;
}

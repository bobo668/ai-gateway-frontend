// 服务商相关类型
export interface Provider {
  id: string
  name: string
  providerType: 'OPENAI' | 'CLAUDE' | 'GEMINI' | 'OTHER'
  endpoint: string
  apiVersion: string
  capabilities: string[]
  isEnabled: boolean
  priority: number
  failoverEnabled: boolean
  status?: 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN'
  lastHealthCheck?: number
}

export interface ProviderFormData {
  name: string
  providerType: Provider['providerType']
  endpoint: string
  apiVersion: string
  capabilities: string[]
  isEnabled: boolean
  priority: number
  failoverEnabled?: boolean
  apiKey?: string
  apiSecret?: string
}

// 消费者相关类型
export interface Consumer {
  id: string
  name: string
  consumerType: 'TEAM' | 'APPLICATION' | 'INDIVIDUAL'
  quota: number
  usedQuota: number
  alertThreshold: number
  isEnabled: boolean
  createdAt: number
  updatedAt: number
}

export interface ConsumerFormData {
  name: string
  consumerType: Consumer['consumerType']
  quota: number
  alertThreshold: number
  isEnabled?: boolean
}

// API Key相关类型
export interface ApiKey {
  id: string
  keyPrefix: string
  name: string
  scopes: string[]
  expiresAt?: number
  createdAt: number
  lastUsedAt?: number
  isActive: boolean
}

export interface ApiKeyFormData {
  name: string
  scopes: string[]
  expiresAt?: number
}

// 访问策略相关类型
export interface Policy {
  id: string
  name: string
  consumerId: string
  consumerName?: string
  providerId: string
  providerName?: string
  modelRestrictions: string[]
  capabilities: string[]
  priority: number
  isAllowed: boolean
  createdAt: number
  updatedAt: number
}

export interface PolicyFormData {
  name: string
  consumerId: string
  providerId: string
  modelRestrictions: string[]
  capabilities: string[]
  priority: number
  isAllowed: boolean
}

// 限流相关类型
export type RateLimitType = 'CONSUMER' | 'APIKEY' | 'GLOBAL'
export type RateLimitPeriod = 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'

export interface RateLimit {
  id: string
  name: string
  limitType: RateLimitType
  targetId?: string
  targetName?: string
  requestsPerSecond?: number
  requestsPerMinute?: number
  requestsPerHour?: number
  requestsPerDay?: number
  tokensPerMinute?: number
  isEnabled: boolean
  createdAt: number
  updatedAt: number
}

export interface RateLimitFormData {
  name: string
  limitType: RateLimitType
  targetId?: string
  requestsPerSecond?: number
  requestsPerMinute?: number
  requestsPerHour?: number
  requestsPerDay?: number
  tokensPerMinute?: number
  isEnabled?: boolean
}

// 调用记录相关类型
export type CallStatus = 'SUCCESS' | 'FAILED' | 'RATE_LIMITED' | 'ERROR'

export interface CallRecord {
  id: string
  traceId: string
  consumerId: string
  consumerName?: string
  providerId: string
  providerName?: string
  model: string
  capability: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  latency: number
  status: CallStatus
  errorCode?: string
  errorMessage?: string
  timestamp: number
}

export interface CallRecordQuery {
  consumerId?: string
  providerId?: string
  status?: CallStatus
  startTime?: number
  endTime?: number
  page?: number
  pageSize?: number
}

// MCP相关类型
export interface McpServer {
  id: string
  name: string
  endpoint: string
  protocolVersion: string
  isEnabled: boolean
  status?: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
  tools?: McpTool[]
  createdAt: number
  updatedAt: number
}

export interface McpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export interface McpServerFormData {
  name: string
  endpoint: string
  protocolVersion: string
  isEnabled?: boolean
}

// 报表相关类型
export interface CostReport {
  totalCost: number
  totalRequests: number
  totalTokens: number
  byConsumer: { name: string; cost: number; requests: number }[]
  byProvider: { name: string; cost: number; requests: number }[]
  byDay: { date: string; cost: number; requests: number }[]
}

export interface CostReportQuery {
  consumerId?: string
  providerId?: string
  startMonth?: string
  endMonth?: string
}

import client from './client'

export interface DashboardStats {
  totalRequests: number
  avgLatency: number
  errorRate: number
  tokenConsumption: number
  cost: number
  providerStats: {
    providerId: string
    providerName: string
    requestCount: number
    cost: number
  }[]
  qpsHistory: {
    timestamp: number
    qps: number
  }[]
}

export interface DashboardQuery {
  startTime?: number
  endTime?: number
  interval?: string
}

export const dashboardApi = {
  getDashboardStats: async (query?: DashboardQuery): Promise<DashboardStats> => {
    const response = await client.get<DashboardStats>('/dashboard/stats', { params: query })
    return response.data
  },

  getQpsTrend: async (minutes: number = 60): Promise<{ timestamp: number; qps: number }[]> => {
    const response = await client.get<{ timestamp: number; qps: number }[]>('/dashboard/qps-trend', {
      params: { minutes },
    })
    return response.data
  },

  getProviderDistribution: async (): Promise<{ name: string; value: number; cost: number }[]> => {
    const response = await client.get<{ name: string; value: number; cost: number }[]>('/dashboard/provider-distribution')
    return response.data
  },
}

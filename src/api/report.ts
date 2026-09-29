import client from './client'
import type { CostReport, CostReportQuery } from '@/types/model'

export const reportApi = {
  getCostOverview: async (): Promise<CostReport> => {
    const response = await client.get<CostReport>('/reports/cost-overview')
    return response.data
  },

  getCostReport: async (query?: CostReportQuery): Promise<CostReport> => {
    const response = await client.get<CostReport>('/reports/cost', { params: query })
    return response.data
  },

  exportMonthlyReport: async (month: string): Promise<Blob> => {
    const response = await client.get('/reports/monthly', {
      params: { month },
      responseType: 'blob',
    })
    return response.data
  },

  getCostAlerts: async (): Promise<{ consumerId: string; consumerName: string; alertType: string; threshold: number; current: number }[]> => {
    const response = await client.get('/reports/cost-alerts')
    return response.data
  },

  updateCostAlert: async (consumerId: string, threshold: number): Promise<void> => {
    await client.put(`/reports/cost-alerts/${consumerId}`, { threshold })
  },
}

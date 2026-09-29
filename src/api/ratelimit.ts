import client from './client'
import type { RateLimit, RateLimitFormData } from '@/types/model'

export const rateLimitApi = {
  getRateLimits: async (): Promise<RateLimit[]> => {
    const response = await client.get<RateLimit[]>('/ratelimits')
    return response.data
  },

  getRateLimit: async (id: string): Promise<RateLimit> => {
    const response = await client.get<RateLimit>(`/ratelimits/${id}`)
    return response.data
  },

  createRateLimit: async (data: RateLimitFormData): Promise<RateLimit> => {
    const response = await client.post<RateLimit>('/ratelimits', data)
    return response.data
  },

  updateRateLimit: async (id: string, data: RateLimitFormData): Promise<RateLimit> => {
    const response = await client.put<RateLimit>(`/ratelimits/${id}`, data)
    return response.data
  },

  deleteRateLimit: async (id: string): Promise<void> => {
    await client.delete(`/ratelimits/${id}`)
  },

  enableRateLimit: async (id: string): Promise<void> => {
    await client.post(`/ratelimits/${id}/enable`)
  },

  disableRateLimit: async (id: string): Promise<void> => {
    await client.post(`/ratelimits/${id}/disable`)
  },
}

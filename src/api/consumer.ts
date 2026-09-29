import client from './client'
import type { Consumer, ConsumerFormData, ApiKey, ApiKeyFormData } from '@/types/model'

export const consumerApi = {
  getConsumers: async (): Promise<Consumer[]> => {
    const response = await client.get<Consumer[]>('/consumers')
    return response.data
  },

  getConsumer: async (id: string): Promise<Consumer> => {
    const response = await client.get<Consumer>(`/consumers/${id}`)
    return response.data
  },

  createConsumer: async (data: ConsumerFormData): Promise<Consumer> => {
    const response = await client.post<Consumer>('/consumers', data)
    return response.data
  },

  updateConsumer: async (id: string, data: ConsumerFormData): Promise<Consumer> => {
    const response = await client.put<Consumer>(`/consumers/${id}`, data)
    return response.data
  },

  deleteConsumer: async (id: string): Promise<void> => {
    await client.delete(`/consumers/${id}`)
  },

  getConsumerApiKeys: async (consumerId: string): Promise<ApiKey[]> => {
    const response = await client.get<ApiKey[]>(`/consumers/${consumerId}/keys`)
    return response.data
  },

  createApiKey: async (consumerId: string, data: ApiKeyFormData): Promise<ApiKey & { rawKey: string }> => {
    const response = await client.post<ApiKey & { rawKey: string }>(`/consumers/${consumerId}/keys`, data)
    return response.data
  },

  revokeApiKey: async (keyId: string): Promise<void> => {
    await client.delete(`/keys/${keyId}`)
  },

  getConsumerUsage: async (consumerId: string, period?: string): Promise<{ used: number; total: number }> => {
    const response = await client.get<{ used: number; total: number }>(`/consumers/${consumerId}/usage`, {
      params: { period },
    })
    return response.data
  },
}

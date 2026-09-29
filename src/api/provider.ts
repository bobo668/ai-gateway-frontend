import client from './client'
import type { Provider, ProviderFormData } from '@/types/model'

export const providerApi = {
  getProviders: async (): Promise<Provider[]> => {
    const response = await client.get<Provider[]>('/providers')
    return response.data
  },

  getProvider: async (id: string): Promise<Provider> => {
    const response = await client.get<Provider>(`/providers/${id}`)
    return response.data
  },

  createProvider: async (data: ProviderFormData): Promise<Provider> => {
    const response = await client.post<Provider>('/providers', data)
    return response.data
  },

  updateProvider: async (id: string, data: ProviderFormData): Promise<Provider> => {
    const response = await client.put<Provider>(`/providers/${id}`, data)
    return response.data
  },

  deleteProvider: async (id: string): Promise<void> => {
    await client.delete(`/providers/${id}`)
  },

  enableProvider: async (id: string): Promise<void> => {
    await client.post(`/providers/${id}/enable`)
  },

  disableProvider: async (id: string): Promise<void> => {
    await client.post(`/providers/${id}/disable`)
  },

  testConnection: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await client.post<{ success: boolean; message: string }>(`/providers/${id}/test`)
    return response.data
  },
}

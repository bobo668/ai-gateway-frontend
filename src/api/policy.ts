import client from './client'
import type { Policy, PolicyFormData } from '@/types/model'

export const policyApi = {
  getPolicies: async (): Promise<Policy[]> => {
    const response = await client.get<Policy[]>('/policies')
    return response.data
  },

  getPolicy: async (id: string): Promise<Policy> => {
    const response = await client.get<Policy>(`/policies/${id}`)
    return response.data
  },

  createPolicy: async (data: PolicyFormData): Promise<Policy> => {
    const response = await client.post<Policy>('/policies', data)
    return response.data
  },

  updatePolicy: async (id: string, data: PolicyFormData): Promise<Policy> => {
    const response = await client.put<Policy>(`/policies/${id}`, data)
    return response.data
  },

  deletePolicy: async (id: string): Promise<void> => {
    await client.delete(`/policies/${id}`)
  },
}

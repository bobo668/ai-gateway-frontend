import client from './client'
import type { CallRecord, CallRecordQuery } from '@/types/model'

export const callRecordApi = {
  getCallRecords: async (query?: CallRecordQuery): Promise<{ data: CallRecord[]; total: number }> => {
    const response = await client.get<{ data: CallRecord[]; total: number }>('/call-records', { params: query })
    return response.data
  },

  getCallRecord: async (id: string): Promise<CallRecord> => {
    const response = await client.get<CallRecord>(`/call-records/${id}`)
    return response.data
  },

  exportCallRecords: async (query?: CallRecordQuery): Promise<Blob> => {
    const response = await client.get('/call-records/export', {
      params: query,
      responseType: 'blob',
    })
    return response.data
  },
}

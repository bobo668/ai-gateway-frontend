import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { callRecordApi } from '@/api/callRecord'
import type { CallRecord, CallRecordQuery } from '@/types/model'

export function useCallRecords(query?: CallRecordQuery) {
  return useQuery({
    queryKey: ['call-records', query],
    queryFn: () => callRecordApi.getCallRecords(query),
  })
}

export function useCallRecord(id: string) {
  return useQuery({
    queryKey: ['call-records', id],
    queryFn: () => callRecordApi.getCallRecord(id),
    enabled: !!id,
  })
}

export function useExportCallRecords() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (query?: CallRecordQuery) => callRecordApi.exportCallRecords(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-records'] })
    },
  })
}

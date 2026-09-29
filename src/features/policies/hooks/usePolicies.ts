import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { policyApi } from '@/api/policy'
import type { Policy, PolicyFormData } from '@/types/model'

export function usePolicies() {
  return useQuery({
    queryKey: ['policies'],
    queryFn: () => policyApi.getPolicies(),
  })
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: ['policies', id],
    queryFn: () => policyApi.getPolicy(id),
    enabled: !!id,
  })
}

export function useCreatePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PolicyFormData) => policyApi.createPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
    },
  })
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PolicyFormData }) =>
      policyApi.updatePolicy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      queryClient.invalidateQueries({ queryKey: ['policies', id] })
    },
  })
}

export function useDeletePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => policyApi.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] })
    },
  })
}

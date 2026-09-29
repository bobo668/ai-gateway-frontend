import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { consumerApi } from '@/api/consumer'
import type { ApiKeyFormData } from '@/types/model'

export function useConsumerApiKeys(consumerId: string) {
  return useQuery({
    queryKey: ['consumers', consumerId, 'api-keys'],
    queryFn: () => consumerApi.getConsumerApiKeys(consumerId),
    enabled: !!consumerId,
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ consumerId, data }: { consumerId: string; data: ApiKeyFormData }) =>
      consumerApi.createApiKey(consumerId, data),
    onSuccess: (_, { consumerId }) => {
      queryClient.invalidateQueries({ queryKey: ['consumers', consumerId, 'api-keys'] })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keyId: string) => consumerApi.revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumers'] })
    },
  })
}

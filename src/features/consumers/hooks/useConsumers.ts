import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { consumerApi } from '@/api/consumer'

export function useConsumers() {
  return useQuery({
    queryKey: ['consumers'],
    queryFn: () => consumerApi.getConsumers(),
  })
}

export function useConsumer(id: string) {
  return useQuery({
    queryKey: ['consumers', id],
    queryFn: () => consumerApi.getConsumer(id),
    enabled: !!id,
  })
}

export function useCreateConsumer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof consumerApi.createConsumer>[0]) => consumerApi.createConsumer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumers'] })
    },
  })
}

export function useUpdateConsumer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof consumerApi.updateConsumer>[1] }) =>
      consumerApi.updateConsumer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['consumers'] })
      queryClient.invalidateQueries({ queryKey: ['consumers', id] })
    },
  })
}

export function useDeleteConsumer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => consumerApi.deleteConsumer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumers'] })
    },
  })
}

export function useConsumerUsage(consumerId: string, period?: string) {
  return useQuery({
    queryKey: ['consumers', consumerId, 'usage', period],
    queryFn: () => consumerApi.getConsumerUsage(consumerId, period),
    enabled: !!consumerId,
  })
}

export function useConsumerApiKeys(consumerId: string) {
  return useQuery({
    queryKey: ['consumers', consumerId, 'keys'],
    queryFn: () => consumerApi.getConsumerApiKeys(consumerId),
    enabled: !!consumerId,
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ consumerId, data }: { consumerId: string; data: Parameters<typeof consumerApi.createApiKey>[1] }) =>
      consumerApi.createApiKey(consumerId, data),
    onSuccess: (_, { consumerId }) => {
      queryClient.invalidateQueries({ queryKey: ['consumers', consumerId, 'keys'] })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keyId: string) => consumerApi.revokeApiKey(keyId),
  })
}

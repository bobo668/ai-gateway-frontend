import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { providerApi } from '@/api/provider'

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: () => providerApi.getProviders(),
  })
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: ['providers', id],
    queryFn: () => providerApi.getProvider(id),
    enabled: !!id,
  })
}

export function useCreateProvider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof providerApi.createProvider>[0]) => providerApi.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
    },
  })
}

export function useUpdateProvider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof providerApi.updateProvider>[1] }) =>
      providerApi.updateProvider(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
      queryClient.invalidateQueries({ queryKey: ['providers', id] })
    },
  })
}

export function useDeleteProvider() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => providerApi.deleteProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] })
    },
  })
}

export function useTestConnection() {
  return useMutation({
    mutationFn: (id: string) => providerApi.testConnection(id),
  })
}

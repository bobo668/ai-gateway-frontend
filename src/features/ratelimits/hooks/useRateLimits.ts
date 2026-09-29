import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rateLimitApi } from '@/api/ratelimit'
import type { RateLimit, RateLimitFormData } from '@/types/model'

export function useRateLimits() {
  return useQuery({
    queryKey: ['ratelimits'],
    queryFn: () => rateLimitApi.getRateLimits(),
  })
}

export function useRateLimit(id: string) {
  return useQuery({
    queryKey: ['ratelimits', id],
    queryFn: () => rateLimitApi.getRateLimit(id),
    enabled: !!id,
  })
}

export function useCreateRateLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: RateLimitFormData) => rateLimitApi.createRateLimit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratelimits'] })
    },
  })
}

export function useUpdateRateLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RateLimitFormData }) =>
      rateLimitApi.updateRateLimit(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ratelimits'] })
      queryClient.invalidateQueries({ queryKey: ['ratelimits', id] })
    },
  })
}

export function useDeleteRateLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rateLimitApi.deleteRateLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratelimits'] })
    },
  })
}

export function useEnableRateLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rateLimitApi.enableRateLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratelimits'] })
    },
  })
}

export function useDisableRateLimit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rateLimitApi.disableRateLimit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratelimits'] })
    },
  })
}

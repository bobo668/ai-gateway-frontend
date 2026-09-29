import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

export function useDashboardStats(timeRange?: { startTime?: number; endTime?: number }) {
  return useQuery({
    queryKey: ['dashboard', 'stats', timeRange],
    queryFn: () => dashboardApi.getDashboardStats(timeRange),
    refetchInterval: 10000, // 每10秒刷新一次
  })
}

export function useQpsTrend(minutes: number = 60) {
  return useQuery({
    queryKey: ['dashboard', 'qpsTrend', minutes],
    queryFn: () => dashboardApi.getQpsTrend(minutes),
    refetchInterval: 10000,
  })
}

export function useProviderDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'providerDistribution'],
    queryFn: () => dashboardApi.getProviderDistribution(),
  })
}

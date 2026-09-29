import { useQuery } from '@tanstack/react-query'
import { reportApi } from '@/api/report'

export function useCostOverview() {
  return useQuery({
    queryKey: ['reports', 'cost-overview'],
    queryFn: () => reportApi.getCostOverview(),
  })
}

export function useCostReport(query?: Parameters<typeof reportApi.getCostReport>[0]) {
  return useQuery({
    queryKey: ['reports', 'cost', query],
    queryFn: () => reportApi.getCostReport(query),
  })
}

export function useCostAlerts() {
  return useQuery({
    queryKey: ['reports', 'cost-alerts'],
    queryFn: () => reportApi.getCostAlerts(),
  })
}

export function useExportMonthlyReport() {
  return useQuery({
    queryKey: ['reports', 'monthly-export'],
    queryFn: async ({ month }: { month: string }) => {
      const blob = await reportApi.exportMonthlyReport(month)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cost-report-${month}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },
    enabled: false,
  })
}

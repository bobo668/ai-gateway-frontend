import type { CostReport } from '@/types/model'
import { formatDate } from '@/utils/format'

export const exportCostReportToCSV = (report: CostReport, filename?: string): void => {
  const headers = [
    '日期/消费者/服务商',
    '费用',
    '请求次数',
    'Token消耗',
  ]

  const rows: string[][] = []

  report.byDay?.forEach((day) => {
    rows.push([day.date, day.cost.toFixed(4), day.requests.toString(), '-'])
  })

  if (report.byConsumer && report.byConsumer.length > 0) {
    rows.push([])
    rows.push(['按消费者统计'])
    report.byConsumer.forEach((item) => {
      rows.push([item.name, item.cost.toFixed(4), item.requests.toString(), '-'])
    })
  }

  if (report.byProvider && report.byProvider.length > 0) {
    rows.push([])
    rows.push(['按服务商统计'])
    report.byProvider.forEach((item) => {
      rows.push([item.name, item.cost.toFixed(4), item.requests.toString(), '-'])
    })
  }

  rows.push([])
  rows.push(['总计', report.totalCost.toFixed(4), report.totalRequests.toString(), report.totalTokens.toString()])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        const cellStr = String(cell)
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`
        }
        return cellStr
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename || `cost-report-${formatDate(Date.now(), 'YYYY-MM')}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const generateCostReportFilename = (startMonth: string, endMonth: string): string => {
  return `cost-report-${startMonth}-to-${endMonth}.csv`
}

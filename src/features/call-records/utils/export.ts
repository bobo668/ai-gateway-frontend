import type { CallRecord } from '@/types/model'
import { formatDate } from '@/utils/format'

export const exportCallRecordsToCSV = (records: CallRecord[], filename?: string): void => {
  const headers = [
    'ID',
    'Trace ID',
    '消费者',
    '服务商',
    '模型',
    '能力',
    'Prompt Tokens',
    'Completion Tokens',
    'Total Tokens',
    '延迟(ms)',
    '状态',
    '错误代码',
    '错误信息',
    '时间',
  ]

  const rows = records.map((record) => [
    record.id,
    record.traceId,
    record.consumerName || record.consumerId,
    record.providerName || record.providerId,
    record.model,
    record.capability,
    record.promptTokens,
    record.completionTokens,
    record.totalTokens,
    record.latency,
    record.status,
    record.errorCode || '',
    record.errorMessage || '',
    formatDate(record.timestamp),
  ])

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
  link.setAttribute('download', filename || `call-records-${formatDate(Date.now(), 'YYYY-MM-DD')}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

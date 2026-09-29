import { Card } from 'antd'
import ReactECharts from 'echarts-for-react'

interface ChartCardProps {
  title: string
  option: Record<string, unknown>
  loading?: boolean
  height?: number
  onRefresh?: () => void
}

export default function ChartCard({ title, option, loading = false, height = 300 }: ChartCardProps) {
  return (
    <Card title={title} loading={loading}>
      <ReactECharts option={option} style={{ height }} />
    </Card>
  )
}

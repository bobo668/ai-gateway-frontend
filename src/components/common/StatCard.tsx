import { Card, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface StatCardProps {
  title: string
  value: number | string
  prefix?: React.ReactNode
  suffix?: string
  precision?: number
  trend?: 'up' | 'down' | 'none'
  trendValue?: string
  loading?: boolean
  onClick?: () => void
}

export default function StatCard({
  title,
  value,
  prefix,
  suffix,
  precision,
  trend = 'none',
  trendValue,
  loading = false,
  onClick,
}: StatCardProps) {
  const trendIcon = trend === 'up' ? <ArrowUpOutlined style={{ color: '#52c41a' }} /> : trend === 'down' ? <ArrowDownOutlined style={{ color: '#ff4d4f' }} /> : null

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Statistic
        title={title}
        value={value}
        precision={precision}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
        formatter={(val) => (typeof val === 'number' ? val.toLocaleString() : val)}
      />
      {trend !== 'none' && trendValue && (
        <div style={{ marginTop: 8, color: trend === 'up' ? '#52c41a' : '#ff4d4f' }}>
          {trendIcon} {trendValue}
        </div>
      )}
    </Card>
  )
}

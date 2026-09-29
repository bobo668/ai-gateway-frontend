import { Card, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

interface DashboardStatCardProps {
  title: string
  value: number
  suffix?: string
  precision?: number
  loading?: boolean
  trend?: 'up' | 'down'
  trendValue?: string
  prefixIcon?: React.ReactNode
}

export default function DashboardStatCard({
  title,
  value,
  suffix,
  precision = 0,
  loading = false,
  trend,
  trendValue,
  prefixIcon,
}: DashboardStatCardProps) {
  return (
    <Card loading={loading} style={{ borderRadius: 8 }}>
      <Statistic
        title={title}
        value={value}
        precision={precision}
        suffix={suffix}
        prefix={prefixIcon}
        valueStyle={{ fontSize: 28, fontWeight: 'bold' }}
      />
      {trend && trendValue && (
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            color: trend === 'up' ? '#52c41a' : '#ff4d4f',
          }}
        >
          {trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span style={{ marginLeft: 4 }}>{trendValue}</span>
        </div>
      )}
    </Card>
  )
}

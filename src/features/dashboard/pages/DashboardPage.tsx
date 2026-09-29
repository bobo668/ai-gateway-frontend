import { Row, Col, Card, Space, DatePicker } from 'antd'
import { useState } from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import DashboardStatCard from '../components/StatCard'
import QpsTrendChart from '../components/QpsTrendChart'
import ProviderDistributionChart from '../components/ProviderDistributionChart'
import CostPieChart from '../components/CostPieChart'
import TimeRangeSelector from '../components/TimeRangeSelector'
import { useDashboardStats, useQpsTrend, useProviderDistribution } from '../hooks/useDashboard'
import { formatNumber, formatDuration, formatCurrency } from '@/utils/format'
import { useAppStore } from '@/stores/appStore'

const { RangePicker } = DatePicker

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<string>('1h')
  const { sidebarCollapsed } = useAppStore()

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats()
  const { data: qpsData, isLoading: qpsLoading } = useQpsTrend(timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : timeRange === '24h' ? 1440 : timeRange === '7d' ? 10080 : 43200)
  const { data: providerData, isLoading: providerLoading } = useProviderDistribution()

  const costData = providerData?.map((p) => ({ name: p.name, value: p.cost })) || []

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>仪表板</h2>
        <Space>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <ReloadOutlined onClick={() => refetchStats()} style={{ fontSize: 16, cursor: 'pointer' }} />
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <DashboardStatCard
            title="总请求数"
            value={stats?.totalRequests || 0}
            precision={0}
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardStatCard
            title="平均延迟"
            value={stats?.avgLatency || 0}
            suffix="ms"
            precision={0}
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardStatCard
            title="错误率"
            value={(stats?.errorRate || 0) * 100}
            suffix="%"
            precision={2}
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardStatCard
            title="总费用"
            value={stats?.cost || 0}
            suffix="¥"
            precision={2}
            loading={statsLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="QPS 趋势" loading={qpsLoading}>
            <QpsTrendChart data={qpsData || []} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="服务商请求量分布" loading={providerLoading}>
            <ProviderDistributionChart data={providerData || []} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="费用占比" loading={providerLoading}>
            <CostPieChart data={costData} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Token 消耗">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 'bold', color: '#1890ff' }}>
                  {formatNumber(stats?.tokenConsumption || 0)}
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>Token 消耗总量</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

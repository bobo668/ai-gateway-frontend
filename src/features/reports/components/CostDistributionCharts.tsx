import { useMemo } from 'react'
import { Row, Col, Card } from 'antd'
import ReactECharts from 'echarts-for-react'

interface CostDistributionChartsProps {
  byConsumer: { name: string; cost: number; requests: number }[]
  byProvider: { name: string; cost: number; requests: number }[]
  loading?: boolean
}

export default function CostDistributionCharts({ byConsumer, byProvider, loading }: CostDistributionChartsProps) {
  const consumerOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: (params: { name: string; value: number }) => `${params.name}: ¥${params.value.toFixed(2)}` },
    series: [
      {
        name: '按消费者',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: byConsumer.map((c, i) => ({
          value: c.cost,
          name: c.name,
          itemStyle: { color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'][i % 6] },
        })),
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        label: { show: true, formatter: '{b}: {d}%' },
      },
    ],
  }), [byConsumer])

  const providerOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: byProvider.map((p) => p.name) },
    yAxis: { type: 'value', name: '费用 (¥)' },
    series: [
      {
        name: '费用',
        type: 'bar',
        data: byProvider.map((p, i) => ({
          value: p.cost,
          itemStyle: { color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'][i % 6] },
        })),
        label: { show: true, position: 'top', formatter: (params: { value: number }) => `¥${params.value.toFixed(0)}` },
      },
    ],
  }), [byProvider])

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="费用分布（按消费者）" loading={loading}>
          <ReactECharts option={consumerOption} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="费用统计（按服务商）" loading={loading}>
          <ReactECharts option={providerOption} style={{ height: 300 }} />
        </Card>
      </Col>
    </Row>
  )
}

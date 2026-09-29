import { useState } from 'react'
import { Row, Col, Card, Statistic, Table, Button, DatePicker, Space, Alert } from 'antd'
import { DownloadOutlined, WarningOutlined } from '@ant-design/icons'
import CostDistributionCharts from '../components/CostDistributionCharts'
import CostFilters from '../components/CostFilters'
import BudgetProgress from '../components/BudgetProgress'
import { useCostOverview, useCostAlerts } from '../hooks/useCostReports'
import { formatCurrency } from '@/utils/format'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

export default function CostReportPage() {
  const [filters, setFilters] = useState({})
  const { data: overview, isLoading } = useCostOverview()
  const { data: alerts } = useCostAlerts()

  const handleExport = () => {
    const month = dayjs().format('YYYY-MM')
    const blob = new Blob([['月份,消费者,服务商,请求数,Token数,费用\n']], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cost-report-${month}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>成本分析报表</h2>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出月度报告</Button>
        </Space>
      </div>

      {alerts && alerts.length > 0 && (
        <Alert
          message="成本预警"
          description={
            <div>
              {alerts.map((alert, i) => (
                <div key={i} style={{ marginTop: 4 }}>
                  <WarningOutlined style={{ color: '#faad14' }} /> {alert.consumerName} 已使用 {((alert.current / alert.threshold) * 100).toFixed(0)}% 的预算
                </div>
              ))}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic title="本月总费用" value={overview?.totalCost || 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic title="本月总请求数" value={overview?.totalRequests || 0} precision={0} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={isLoading}>
            <Statistic title="本月总Token数" value={overview?.totalTokens || 0} precision={0} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <CostFilters
          value={filters}
          onChange={setFilters}
        />
      </Card>

      <CostDistributionCharts
        byConsumer={overview?.byConsumer || []}
        byProvider={overview?.byProvider || []}
        loading={isLoading}
      />

      <Card title="每日费用趋势" style={{ marginTop: 16 }} loading={isLoading}>
        <Table
          dataSource={overview?.byDay?.map((d, i) => ({ ...d, key: i })) || []}
          columns={[
            { title: '日期', dataIndex: 'date' },
            { title: '请求数', dataIndex: 'requests', render: (v) => v.toLocaleString() },
            { title: '费用', dataIndex: 'cost', render: (v) => formatCurrency(v) },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  )
}

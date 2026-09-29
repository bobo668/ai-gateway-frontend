import { Badge, Card, List, Typography, Space, Button, Progress } from 'antd'
import { WarningOutlined, BellOutlined, CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Text, Title } = Typography

interface RateLimitAlertProps {
  alerts: {
    id: string
    ruleName: string
    dimension: 'CONSUMER' | 'APIKEY' | 'GLOBAL'
    targetName?: string
    currentRate: number
    limit: number
    percentage: number
    triggeredAt: number
    isActive: boolean
  }[]
  onAcknowledge?: (alertId: string) => void
  onViewRule?: (ruleId: string) => void
}

export default function RateLimitAlert({ alerts, onAcknowledge, onViewRule }: RateLimitAlertProps) {
  const [activeAlerts, setActiveAlerts] = useState(alerts.filter((a) => a.isActive))

  const handleAcknowledge = (alertId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId))
    onAcknowledge?.(alertId)
  }

  const dimensionMap = {
    GLOBAL: '全局',
    CONSUMER: '消费者',
    APIKEY: 'API Key',
  }

  if (activeAlerts.length === 0) {
    return (
      <Card size="small" title="限流告警">
        <div style={{ textAlign: 'center', padding: 24 }}>
          <BellOutlined style={{ fontSize: 32, color: '#52c41a' }} />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            当前无活跃限流告警
          </Text>
        </div>
      </Card>
    )
  }

  return (
    <Card
      size="small"
      title={
        <Space>
          <WarningOutlined style={{ color: '#faad14' }} />
          <span>限流告警 ({activeAlerts.length})</span>
        </Space>
      }
    >
      <List
        dataSource={activeAlerts}
        renderItem={(alert) => (
          <List.Item
            key={alert.id}
            actions={[
              <Button key="view" type="link" size="small" onClick={() => onViewRule?.(alert.id)}>
                查看规则
              </Button>,
              <Button
                key="ack"
                type="link"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleAcknowledge(alert.id)}
              >
                确认
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Badge status="warning" />
                  <Text strong>{alert.ruleName}</Text>
                  <Text type="secondary">- {dimensionMap[alert.dimension]}</Text>
                  {alert.targetName && <Text type="secondary">→ {alert.targetName}</Text>}
                </Space>
              }
              description={
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Progress
                    percent={Math.min(alert.percentage, 100)}
                    status={alert.percentage >= 90 ? 'exception' : 'active'}
                    size="small"
                    format={(percent) => `${percent}%`}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    当前: {alert.currentRate} / 限制: {alert.limit}
                    <span style={{ marginLeft: 8 }}>
                      (触发时间: {new Date(alert.triggeredAt).toLocaleString('zh-CN')})
                    </span>
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}

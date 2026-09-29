import { Card, Descriptions, Tag, Typography, Space } from 'antd'

const { Text } = Typography

interface RateLimitPreviewProps {
  name: string
  limitType: 'CONSUMER' | 'APIKEY' | 'GLOBAL'
  targetName?: string
  requestsPerSecond?: number
  requestsPerMinute?: number
  requestsPerHour?: number
  requestsPerDay?: number
  tokensPerMinute?: number
}

export default function RateLimitPreview({
  name,
  limitType,
  targetName,
  requestsPerSecond,
  requestsPerMinute,
  requestsPerHour,
  requestsPerDay,
  tokensPerMinute,
}: RateLimitPreviewProps) {
  const limits: { label: string; value: number | undefined; unit: string }[] = []

  if (requestsPerSecond) {
    limits.push({ label: '每秒请求数', value: requestsPerSecond, unit: '次/秒' })
  }
  if (requestsPerMinute) {
    limits.push({ label: '每分钟请求数', value: requestsPerMinute, unit: '次/分' })
  }
  if (requestsPerHour) {
    limits.push({ label: '每小时请求数', value: requestsPerHour, unit: '次/时' })
  }
  if (requestsPerDay) {
    limits.push({ label: '每天请求数', value: requestsPerDay, unit: '次/天' })
  }
  if (tokensPerMinute) {
    limits.push({ label: '每分钟Token数', value: tokensPerMinute, unit: 'Tokens/分' })
  }

  const dimensionMap = {
    GLOBAL: { color: 'purple', text: '全局' },
    CONSUMER: { color: 'blue', text: '消费者' },
    APIKEY: { color: 'green', text: 'API Key' },
  }

  return (
    <Card size="small" title="限流规则预览">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="规则名称">{name || '-'}</Descriptions.Item>
        <Descriptions.Item label="限流维度">
          <Tag color={dimensionMap[limitType].color}>{dimensionMap[limitType].text}</Tag>
          {targetName && <Text type="secondary" style={{ marginLeft: 8 }}>→ {targetName}</Text>}
        </Descriptions.Item>
      </Descriptions>

      {limits.length > 0 ? (
        <div style={{ marginTop: 16 }}>
          <Text strong>限制配置：</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }} size="small">
            {limits.map((limit, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f5f5f5',
                  borderRadius: 4,
                }}
              >
                <Text>{limit.label}</Text>
                <Text strong>
                  {limit.value} {limit.unit}
                </Text>
              </div>
            ))}
          </Space>
        </div>
      ) : (
        <div style={{ marginTop: 16, padding: 12, background: '#fffbe6', borderRadius: 4, border: '1px solid #ffe58f' }}>
          <Text type="warning">请配置至少一个限流阈值</Text>
        </div>
      )}
    </Card>
  )
}

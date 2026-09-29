import { Card, Form, Radio, Select, Space, Typography } from 'antd'
import { useConsumers } from '@/features/consumers/hooks/useConsumers'
import { useApiKeys } from '@/features/api-keys/hooks/useApiKeys'

const { Text } = Typography

interface RateLimitDimensionSelectorProps {
  value?: {
    limitType: 'CONSUMER' | 'APIKEY' | 'GLOBAL'
    targetId?: string
  }
  onChange?: (value: { limitType: 'CONSUMER' | 'APIKEY' | 'GLOBAL'; targetId?: string }) => void
  disabled?: boolean
}

export default function RateLimitDimensionSelector({
  value,
  onChange,
  disabled,
}: RateLimitDimensionSelectorProps) {
  const dimension = value?.limitType || 'GLOBAL'
  const targetId = value?.targetId

  const { data: consumers } = useConsumers()
  const { data: apiKeys } = useApiKeys()

  const handleDimensionChange = (limitType: 'CONSUMER' | 'APIKEY' | 'GLOBAL') => {
    onChange?.({ limitType, targetId: undefined })
  }

  const handleTargetChange = (newTargetId: string) => {
    onChange?.({ limitType: dimension, targetId: newTargetId })
  }

  const consumerOptions = consumers?.map((c) => ({ value: c.id, label: c.name })) || []
  const apiKeyOptions = apiKeys?.map((k) => ({ value: k.id, label: `${k.name} (${k.keyPrefix}...)` })) || []

  const dimensionOptions = [
    { value: 'GLOBAL', label: '全局维度', description: '对所有请求生效，不区分消费者和API Key' },
    { value: 'CONSUMER', label: '消费者维度', description: '针对特定消费者限流' },
    { value: 'APIKEY', label: 'API Key维度', description: '针对特定API Key限流' },
  ]

  return (
    <Card size="small" title="限流维度">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Radio.Group
          value={dimension}
          onChange={(e) => handleDimensionChange(e.target.value)}
          disabled={disabled}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {dimensionOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value} style={{ width: '100%' }}>
                <Space direction="vertical" style={{ marginLeft: 8 }}>
                  <Text strong>{opt.label}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {opt.description}
                  </Text>
                </Space>
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        {dimension === 'CONSUMER' && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              选择消费者
            </Text>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择消费者"
              options={consumerOptions}
              value={targetId}
              onChange={handleTargetChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
        )}

        {dimension === 'APIKEY' && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              选择API Key
            </Text>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择API Key"
              options={apiKeyOptions}
              value={targetId}
              onChange={handleTargetChange}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
        )}

        {dimension === 'GLOBAL' && (
          <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <Text type="secondary">
              全局限流将对所有传入请求生效，适用于整体流量控制和保护后端服务。
            </Text>
          </div>
        )}
      </Space>
    </Card>
  )
}

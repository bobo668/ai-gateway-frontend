import { Card, Form, Select, Space, Tag, Typography } from 'antd'
import { useState, useEffect } from 'react'
import { useConsumers } from '@/features/consumers/hooks/useConsumers'
import { useProviders } from '@/features/providers/hooks/useProviders'

const { Text } = Typography

interface PolicyScope {
  consumerId?: string
  providerId?: string
  models?: string[]
}

interface PolicyScopeSelectorProps {
  value?: PolicyScope
  onChange?: (value: PolicyScope) => void
  disabled?: boolean
}

const modelOptions = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-ultra', label: 'Gemini Ultra' },
]

export default function PolicyScopeSelector({ value, onChange, disabled }: PolicyScopeSelectorProps) {
  const [scope, setScope] = useState<PolicyScope>(value || {})
  const { data: consumers } = useConsumers()
  const { data: providers } = useProviders()

  useEffect(() => {
    if (value) {
      setScope(value)
    }
  }, [value])

  const handleChange = (key: keyof PolicyScope, val: unknown) => {
    const newScope = { ...scope, [key]: val }
    if (key === 'consumerId') {
      newScope.providerId = undefined
      newScope.models = undefined
    } else if (key === 'providerId') {
      newScope.models = undefined
    }
    setScope(newScope)
    onChange?.(newScope)
  }

  const consumerOptions = consumers?.map((c) => ({ value: c.id, label: c.name })) || []
  const providerOptions = providers?.filter((p) => p.isEnabled).map((p) => ({ value: p.id, label: p.name })) || []

  const selectedConsumer = consumers?.find((c) => c.id === scope.consumerId)
  const selectedProvider = providers?.find((p) => p.id === scope.providerId)

  const isStepDisabled = (step: 'consumer' | 'provider' | 'model') => {
    if (disabled) return true
    if (step === 'consumer') return false
    if (step === 'provider') return !scope.consumerId
    if (step === 'model') return !scope.providerId
    return false
  }

  return (
    <Card size="small" title="策略范围选择">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            第一步：选择消费者
          </Text>
          <Select
            style={{ width: '100%' }}
            placeholder="请选择消费者"
            options={consumerOptions}
            value={scope.consumerId}
            onChange={(val) => handleChange('consumerId', val)}
            disabled={isStepDisabled('consumer')}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            第二步：选择服务商
          </Text>
          <Select
            style={{ width: '100%' }}
            placeholder={scope.consumerId ? '请选择服务商' : '请先选择消费者'}
            options={providerOptions}
            value={scope.providerId}
            onChange={(val) => handleChange('providerId', val)}
            disabled={isStepDisabled('provider')}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            第三步：选择允许的模型（可选）
          </Text>
          <Select
            style={{ width: '100%' }}
            placeholder={scope.providerId ? '请选择允许的模型，不选则全部允许' : '请先选择服务商'}
            options={modelOptions}
            mode="multiple"
            value={scope.models}
            onChange={(val) => handleChange('models', val)}
            disabled={isStepDisabled('model')}
          />
        </div>

        {scope.consumerId && scope.providerId && (
          <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <Text type="secondary">当前配置：</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">{selectedConsumer?.name || scope.consumerId}</Tag>
              <span style={{ margin: '0 8px' }}>→</span>
              <Tag color="green">{selectedProvider?.name || scope.providerId}</Tag>
              {scope.models && scope.models.length > 0 ? (
                <>
                  <span style={{ margin: '0 8px' }}>→</span>
                  <Tag color="orange">{scope.models.length}个模型</Tag>
                </>
              ) : (
                <>
                  <span style={{ margin: '0 8px' }}>→</span>
                  <Tag color="default">全部模型</Tag>
                </>
              )}
            </div>
          </div>
        )}
      </Space>
    </Card>
  )
}

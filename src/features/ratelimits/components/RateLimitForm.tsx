import { Form, Input, Select, Switch, InputNumber, message } from 'antd'
import { useCreateRateLimit, useUpdateRateLimit } from '../hooks/useRateLimits'
import { useConsumers } from '@/features/consumers/hooks/useConsumers'
import { useConsumerApiKeys } from '@/features/consumers/hooks/useConsumers'
import type { RateLimit, RateLimitFormData, RateLimitType } from '@/types/model'

interface RateLimitFormProps {
  initialValues?: RateLimit
  onSuccess?: () => void
  onCancel?: () => void
}

const limitTypeOptions = [
  { value: 'CONSUMER', label: '按消费者' },
  { value: 'APIKEY', label: '按 API Key' },
  { value: 'GLOBAL', label: '全局' },
]

export default function RateLimitForm({ initialValues, onSuccess, onCancel }: RateLimitFormProps) {
  const [form] = Form.useForm<RateLimitFormData>()
  const createMutation = useCreateRateLimit()
  const updateMutation = useUpdateRateLimit()

  const limitType = Form.useWatch('limitType', form)
  const consumerId = Form.useWatch('targetId', form)

  const { data: consumers } = useConsumers()
  const { data: apiKeys } = useConsumerApiKeys(consumerId || '')

  const consumerOptions = consumers?.map((c) => ({
    value: c.id,
    label: c.name,
  })) || []

  const apiKeyOptions = apiKeys?.map((key) => ({
    value: key.id,
    label: `${key.name} (${key.keyPrefix}...)`,
  })) || []

  const handleSubmit = async (values: RateLimitFormData) => {
    try {
      if (initialValues) {
        await updateMutation.mutateAsync({ id: initialValues.id, data: values })
        message.success('更新成功')
      } else {
        await createMutation.mutateAsync(values)
        message.success('创建成功')
      }
      onSuccess?.()
    } catch {
      message.error('操作失败')
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="限流名称"
        rules={[{ required: true, message: '请输入限流名称' }]}
      >
        <Input placeholder="请输入限流名称" />
      </Form.Item>

      <Form.Item
        name="limitType"
        label="限流维度"
        rules={[{ required: true, message: '请选择限流维度' }]}
      >
        <Select
          options={limitTypeOptions}
          placeholder="请选择限流维度"
          onChange={() => {
            form.setFieldValue('targetId', undefined)
          }}
        />
      </Form.Item>

      {limitType === 'CONSUMER' && (
        <Form.Item
          name="targetId"
          label="消费者"
          rules={[{ required: true, message: '请选择消费者' }]}
        >
          <Select
            showSearch
            options={consumerOptions}
            placeholder="请选择消费者"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      )}

      {limitType === 'APIKEY' && (
        <>
          <Form.Item
            name="targetId"
            label="消费者"
            rules={[{ required: true, message: '请先选择消费者' }]}
          >
            <Select
              showSearch
              options={consumerOptions}
              placeholder="请先选择消费者"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={() => {
                form.setFieldValue('targetId', undefined)
              }}
            />
          </Form.Item>
          <Form.Item
            name="targetId"
            label="API Key"
            rules={[{ required: true, message: '请选择 API Key' }]}
          >
            <Select
              showSearch
              options={apiKeyOptions}
              placeholder="请选择 API Key"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              disabled={!consumerId}
            />
          </Form.Item>
        </>
      )}

      <Form.Item label="请求限制" style={{ marginBottom: 8 }}>
        <span style={{ color: '#999', fontSize: 12 }}>至少填写一项</span>
      </Form.Item>

      <Form.Item name="requestsPerSecond" label="每秒请求数">
        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="requestsPerMinute" label="每分钟请求数">
        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="requestsPerHour" label="每小时请求数">
        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="requestsPerDay" label="每天请求数">
        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="tokensPerMinute" label="每分钟 Token 数">
        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="isEnabled" label="启用状态" valuePropName="checked" initialValue={true}>
        <Switch />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <button type="button" onClick={onCancel} style={{ marginRight: 8, padding: '8px 16px' }}>
          取消
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          style={{ padding: '8px 16px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {initialValues ? '更新' : '创建'}
        </button>
      </Form.Item>
    </Form>
  )
}

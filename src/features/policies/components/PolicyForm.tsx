import { Form, Input, Select, Switch, InputNumber, message } from 'antd'
import { useCreatePolicy, useUpdatePolicy } from '../hooks/usePolicies'
import { useConsumers } from '@/features/consumers/hooks/useConsumers'
import { useProviders } from '@/features/providers/hooks/useProviders'
import type { Policy, PolicyFormData } from '@/types/model'

interface PolicyFormProps {
  initialValues?: Policy
  onSuccess?: () => void
  onCancel?: () => void
}

const capabilityOptions = [
  { value: 'TEXT', label: '文本生成' },
  { value: 'IMAGE', label: '图像生成' },
  { value: 'EMBEDDING', label: '向量嵌入' },
  { value: 'VIDEO', label: '视频生成' },
  { value: 'AUDIO', label: '音频生成' },
]

const modelRestrictionOptions = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3-opus', label: 'Claude 3 Opus' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: '*', label: '全部模型' },
]

export default function PolicyForm({ initialValues, onSuccess, onCancel }: PolicyFormProps) {
  const [form] = Form.useForm<PolicyFormData>()
  const createMutation = useCreatePolicy()
  const updateMutation = useUpdatePolicy()

  const { data: consumers } = useConsumers()
  const { data: providers } = useProviders()

  const consumerOptions = consumers?.map((c) => ({
    value: c.id,
    label: c.name,
  })) || []

  const providerOptions = providers?.map((p) => ({
    value: p.id,
    label: p.name,
  })) || []

  const handleSubmit = async (values: PolicyFormData) => {
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
        label="策略名称"
        rules={[{ required: true, message: '请输入策略名称' }]}
      >
        <Input placeholder="请输入策略名称" />
      </Form.Item>

      <Form.Item
        name="consumerId"
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

      <Form.Item
        name="providerId"
        label="服务商"
        rules={[{ required: true, message: '请选择服务商' }]}
      >
        <Select
          showSearch
          options={providerOptions}
          placeholder="请选择服务商"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item
        name="capabilities"
        label="允许的能力"
        rules={[{ required: true, message: '请选择至少一项能力' }]}
      >
        <Select mode="multiple" options={capabilityOptions} placeholder="请选择允许的能力" />
      </Form.Item>

      <Form.Item name="modelRestrictions" label="模型限制">
        <Select mode="multiple" options={modelRestrictionOptions} placeholder="请选择允许的模型，不选则全部允许" />
      </Form.Item>

      <Form.Item name="priority" label="优先级" initialValue={100}>
        <InputNumber min={1} max={1000} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="isAllowed" label="允许访问" valuePropName="checked" initialValue={true}>
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

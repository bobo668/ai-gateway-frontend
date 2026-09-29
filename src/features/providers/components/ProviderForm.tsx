import { Form, Input, Select, Switch, InputNumber, message } from 'antd'
import { useCreateProvider, useUpdateProvider } from '../hooks/useProviders'
import type { Provider, ProviderFormData } from '@/types/model'

interface ProviderFormProps {
  initialValues?: Provider
  onSuccess?: () => void
  onCancel?: () => void
}

const providerTypeOptions = [
  { value: 'OPENAI', label: 'OpenAI' },
  { value: 'CLAUDE', label: 'Claude' },
  { value: 'GEMINI', label: 'Gemini' },
  { value: 'OTHER', label: '其他' },
]

const capabilityOptions = [
  { value: 'TEXT', label: '文本生成' },
  { value: 'IMAGE', label: '图像生成' },
  { value: 'EMBEDDING', label: '向量嵌入' },
]

export default function ProviderForm({ initialValues, onSuccess, onCancel }: ProviderFormProps) {
  const [form] = Form.useForm<ProviderFormData>()
  const createMutation = useCreateProvider()
  const updateMutation = useUpdateProvider()

  const handleSubmit = async (values: ProviderFormData) => {
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
        label="服务商名称"
        rules={[{ required: true, message: '请输入服务商名称' }]}
      >
        <Input placeholder="请输入服务商名称" />
      </Form.Item>

      <Form.Item
        name="providerType"
        label="服务商类型"
        rules={[{ required: true, message: '请选择服务商类型' }]}
      >
        <Select options={providerTypeOptions} placeholder="请选择服务商类型" />
      </Form.Item>

      <Form.Item
        name="endpoint"
        label="API 端点"
        rules={[{ required: true, message: '请输入API端点' }]}
      >
        <Input placeholder="https://api.openai.com/v1" />
      </Form.Item>

      <Form.Item name="apiVersion" label="API 版本" initialValue="2024-01">
        <Input placeholder="2024-01" />
      </Form.Item>

      <Form.Item
        name="capabilities"
        label="支持的能力"
        rules={[{ required: true, message: '请选择至少一项能力' }]}
      >
        <Select mode="multiple" options={capabilityOptions} placeholder="请选择支持的能力" />
      </Form.Item>

      <Form.Item name="priority" label="优先级" initialValue={100}>
        <InputNumber min={1} max={1000} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="failoverEnabled" label="启用故障转移" valuePropName="checked" initialValue={false}>
        <Switch />
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

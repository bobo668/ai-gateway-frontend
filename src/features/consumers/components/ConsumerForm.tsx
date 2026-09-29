import { Form, Input, Select, Switch, InputNumber, message } from 'antd'
import { useCreateConsumer, useUpdateConsumer } from '../hooks/useConsumers'
import type { Consumer, ConsumerFormData } from '@/types/model'

interface ConsumerFormProps {
  initialValues?: Consumer
  onSuccess?: () => void
  onCancel?: () => void
}

const consumerTypeOptions = [
  { value: 'TEAM', label: '团队' },
  { value: 'APPLICATION', label: '应用' },
  { value: 'INDIVIDUAL', label: '个人' },
]

export default function ConsumerForm({ initialValues, onSuccess, onCancel }: ConsumerFormProps) {
  const [form] = Form.useForm<ConsumerFormData>()
  const createMutation = useCreateConsumer()
  const updateMutation = useUpdateConsumer()

  const handleSubmit = async (values: ConsumerFormData) => {
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
        label="消费者名称"
        rules={[{ required: true, message: '请输入消费者名称' }]}
      >
        <Input placeholder="请输入消费者名称" />
      </Form.Item>

      <Form.Item
        name="consumerType"
        label="消费者类型"
        rules={[{ required: true, message: '请选择消费者类型' }]}
      >
        <Select options={consumerTypeOptions} placeholder="请选择消费者类型" />
      </Form.Item>

      <Form.Item
        name="quota"
        label="配额额度"
        rules={[{ required: true, message: '请输入配额额度' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入配额额度" />
      </Form.Item>

      <Form.Item
        name="alertThreshold"
        label="告警阈值 (%)"
        rules={[{ required: true, message: '请输入告警阈值' }]}
        tooltip="当配额使用超过此百分比时发送告警通知"
      >
        <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入告警阈值" />
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

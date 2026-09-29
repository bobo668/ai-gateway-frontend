import { Form, Input, Switch, message } from 'antd'
import { useCreateMcpServer, useUpdateMcpServer } from '../hooks/useMcpServers'
import type { McpServer, McpServerFormData } from '@/types/model'

interface McpServerFormProps {
  initialValues?: McpServer
  onSuccess?: () => void
  onCancel?: () => void
}

export default function McpServerForm({ initialValues, onSuccess, onCancel }: McpServerFormProps) {
  const [form] = Form.useForm<McpServerFormData>()
  const createMutation = useCreateMcpServer()
  const updateMutation = useUpdateMcpServer()

  const handleSubmit = async (values: McpServerFormData) => {
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
        label="服务器名称"
        rules={[{ required: true, message: '请输入服务器名称' }]}
      >
        <Input placeholder="请输入服务器名称" />
      </Form.Item>

      <Form.Item
        name="endpoint"
        label="服务器端点"
        rules={[
          { required: true, message: '请输入服务器端点' },
          { type: 'url', message: '请输入有效的 URL' },
        ]}
      >
        <Input placeholder="https://localhost:8080/mcp" />
      </Form.Item>

      <Form.Item
        name="protocolVersion"
        label="协议版本"
        rules={[{ required: true, message: '请输入协议版本' }]}
        initialValue="2024-11-05"
      >
        <Input placeholder="2024-11-05" />
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
          style={{
            padding: '8px 16px',
            background: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {initialValues ? '更新' : '创建'}
        </button>
      </Form.Item>
    </Form>
  )
}

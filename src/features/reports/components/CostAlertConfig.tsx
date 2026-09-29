import { Card, Form, InputNumber, Switch, Select, message, Space, Typography, Divider, Button } from 'antd'
import { BellOutlined, SaveOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useConsumers } from '@/features/consumers/hooks/useConsumers'

const { Text } = Typography

interface CostAlertConfigProps {
  consumerId?: string
  initialValues?: {
    enabled: boolean
    monthlyBudget?: number
    alertThreshold?: number
    emailRecipients?: string[]
  }
  onSave?: (values: {
    enabled: boolean
    monthlyBudget?: number
    alertThreshold?: number
    emailRecipients?: string[]
  }) => Promise<void>
}

export default function CostAlertConfig({
  consumerId,
  initialValues,
  onSave,
}: CostAlertConfigProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { data: consumers } = useConsumers()

  const handleSave = async (values: {
    enabled: boolean
    monthlyBudget?: number
    alertThreshold?: number
    emailRecipients?: string[]
  }) => {
    setLoading(true)
    try {
      await onSave?.(values)
      message.success('成本预警配置已保存')
    } catch {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const consumerOptions = consumers?.map((c) => ({ value: c.id, label: c.name })) || []

  return (
    <Card
      size="small"
      title={
        <Space>
          <BellOutlined />
          <span>成本预警配置</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          enabled: initialValues?.enabled ?? false,
          monthlyBudget: initialValues?.monthlyBudget ?? 1000,
          alertThreshold: initialValues?.alertThreshold ?? 80,
          emailRecipients: initialValues?.emailRecipients ?? [],
        }}
        onFinish={handleSave}
      >
        <Form.Item
          name="enabled"
          label="启用成本预警"
          valuePropName="checked"
          extra="启用后，当消费达到预警阈值时将发送通知"
        >
          <Switch />
        </Form.Item>

        <Divider style={{ margin: '16px 0' }} />

        <Form.Item
          name="consumerId"
          label="关联消费者"
          extra="留空则表示全局配置，对所有消费者生效"
        >
          <Select
            allowClear
            placeholder="请选择消费者（可选）"
            options={consumerOptions}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="monthlyBudget"
          label="月度预算"
          extra="设置月度消费上限，达到后将阻止新的API调用"
          rules={[{ required: true, message: '请输入月度预算' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={100}
            prefix="¥"
            placeholder="请输入月度预算"
          />
        </Form.Item>

        <Form.Item
          name="alertThreshold"
          label="预警阈值"
          extra="当消费达到预算的此百分比时发送预警通知"
          rules={[{ required: true, message: '请输入预警阈值' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            suffix="%"
            placeholder="请输入预警阈值"
          />
        </Form.Item>

        <Form.Item
          name="emailRecipients"
          label="通知邮箱"
          extra="当触发预警时，通知将发送至以下邮箱"
        >
          <Select
            mode="tags"
            placeholder="输入邮箱地址后按回车添加"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={loading}
          >
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

import { useState } from 'react'
import { Modal, Form, Input, DatePicker, Button, Space, message, Alert } from 'antd'
import { KeyOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ApiKeyFormData } from '@/types/model'

interface ApiKeyGenerateProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  consumerId: string
  onCreate: (data: ApiKeyFormData) => Promise<{ rawKey: string }>
}

export default function ApiKeyGenerate({
  open,
  onCancel,
  onSuccess,
  consumerId,
  onCreate,
}: ApiKeyGenerateProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const data: ApiKeyFormData = {
        name: values.name,
        scopes: values.scopes || [],
        expiresAt: values.expiresAt ? dayjs(values.expiresAt).valueOf() : undefined,
      }

      const result = await onCreate(data)
      setGeneratedKey(result.rawKey)
      message.success('API Key 生成成功，请妥善保管')
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || '生成失败')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey)
      setCopied(true)
      message.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setGeneratedKey(null)
    setCopied(false)
    form.resetFields()
    onCancel()
  }

  const handleDone = () => {
    handleClose()
    onSuccess()
  }

  return (
    <Modal
      title={
        <Space>
          <KeyOutlined />
          <span>生成 API Key</span>
        </Space>
      }
      open={open}
      onCancel={handleClose}
      footer={generatedKey ? null : undefined}
      width={500}
      destroyOnClose
    >
      {generatedKey ? (
        <div>
          <Alert
            type="warning"
            message="请立即复制此 API Key"
            description="此密钥只显示一次，关闭后将无法再次查看完整密钥。请妥善保管，切勿泄露给他人。"
            style={{ marginBottom: 16 }}
            showIcon
          />
          <div style={{ marginBottom: 16 }}>
            <Input.Group compact style={{ display: 'flex' }}>
              <Input
                value={generatedKey}
                readOnly
                style={{ fontFamily: 'monospace', flex: 1 }}
                data-testid="raw-key-input"
              />
              <Button
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
                style={{ flexShrink: 0 }}
              >
                {copied ? '已复制' : '复制'}
              </Button>
            </Input.Group>
          </div>
          <Button type="primary" onClick={handleDone} style={{ width: '100%' }}>
            完成
          </Button>
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Key 名称"
            rules={[{ required: true, message: '请输入 Key 名称' }]}
          >
            <Input placeholder="请输入 Key 名称，如：Production Key" />
          </Form.Item>

          <Form.Item name="scopes" label="权限范围">
            <Input placeholder="请输入权限范围，用逗号分隔" />
          </Form.Item>

          <Form.Item name="expiresAt" label="过期时间">
            <DatePicker
              style={{ width: '100%' }}
              showTime
              placeholder="不设置则永不过期"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose}>取消</Button>
              <Button type="primary" loading={loading} onClick={handleSubmit}>
                生成
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

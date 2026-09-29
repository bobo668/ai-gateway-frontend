import { Card, Table, Button, Space, Modal, Form, Select, message } from 'antd'
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useProviders } from '../hooks/useProviders'

interface FailoverTarget {
  id: string
  providerId: string
  providerName?: string
  priority: number
  threshold: number
}

interface ProviderFailoverConfigProps {
  providerId: string
}

export default function ProviderFailoverConfig({ providerId }: ProviderFailoverConfigProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failoverTargets, setFailoverTargets] = useState<FailoverTarget[]>([])
  const { data: providers } = useProviders()

  const availableProviders = (providers || []).filter(
    (p) => p.id !== providerId && p.isEnabled
  )

  const handleAddTarget = () => {
    setModalVisible(true)
  }

  const handleDeleteTarget = (targetId: string) => {
    setFailoverTargets((prev) => prev.filter((t) => t.id !== targetId))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: 调用API保存故障转移配置
      message.success('故障转移配置已保存')
      setModalVisible(false)
    } catch {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '备选服务商',
      dataIndex: 'providerName',
      key: 'providerName',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: '故障阈值',
      dataIndex: 'threshold',
      key: 'threshold',
      render: (val: number) => `${val}次失败`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: FailoverTarget) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteTarget(record.id)}
        >
          移除
        </Button>
      ),
    },
  ]

  return (
    <Card
      title="故障转移配置"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => {}}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTarget}>
            添加备选
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={failoverTargets}
        rowKey="id"
        locale={{ emptyText: '暂无配置，点击"添加备选"配置故障转移目标' }}
      />

      <Modal
        title="添加故障转移目标"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="选择备选服务商" required>
            <Select placeholder="请选择备选服务商">
              {availableProviders.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="优先级" initialValue={1}>
            <Select placeholder="优先级">
              {[1, 2, 3, 4, 5].map((p) => (
                <Select.Option key={p} value={p}>
                  优先级 {p}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="故障阈值" tooltip="连续失败多少次后触发故障转移">
            <Form.Item noStyle initialValue={3}>
              <Select placeholder="故障阈值">
                {[1, 2, 3, 5, 10].map((t) => (
                  <Select.Option key={t} value={t}>
                    连续 {t} 次失败
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

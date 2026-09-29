import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm, Tag, Switch } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import { useRateLimits, useDeleteRateLimit, useEnableRateLimit, useDisableRateLimit } from '../hooks/useRateLimits'
import RateLimitForm from '../components/RateLimitForm'
import type { RateLimit } from '@/types/model'

export default function RateLimitListPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRateLimit, setEditingRateLimit] = useState<RateLimit | null>(null)

  const { data: rateLimits, isLoading } = useRateLimits()
  const deleteMutation = useDeleteRateLimit()
  const enableMutation = useEnableRateLimit()
  const disableMutation = useDisableRateLimit()

  const handleEdit = (record: RateLimit) => {
    setEditingRateLimit(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  const handleToggle = async (record: RateLimit) => {
    try {
      if (record.isEnabled) {
        await disableMutation.mutateAsync(record.id)
        message.success('已禁用')
      } else {
        await enableMutation.mutateAsync(record.id)
        message.success('已启用')
      }
    } catch {
      message.error('操作失败')
    }
  }

  const formatLimitDisplay = (record: RateLimit) => {
    const limits: string[] = []
    if (record.requestsPerSecond) limits.push(`${record.requestsPerSecond}/秒`)
    if (record.requestsPerMinute) limits.push(`${record.requestsPerMinute}/分`)
    if (record.requestsPerHour) limits.push(`${record.requestsPerHour}/时`)
    if (record.requestsPerDay) limits.push(`${record.requestsPerDay}/天`)
    if (record.tokensPerMinute) limits.push(`${record.tokensPerMinute} Token/分`)
    return limits.length > 0 ? limits.join(', ') : '-'
  }

  const columns: Columns<RateLimit> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '维度',
      dataIndex: 'limitType',
      key: 'limitType',
      render: (type: RateLimit['limitType']) => {
        const colorMap: Record<string, string> = {
          CONSUMER: 'green',
          APIKEY: 'blue',
          GLOBAL: 'purple',
        }
        const textMap: Record<string, string> = {
          CONSUMER: '消费者',
          APIKEY: 'API Key',
          GLOBAL: '全局',
        }
        return <Tag color={colorMap[type]}>{textMap[type]}</Tag>
      },
    },
    {
      title: '目标',
      dataIndex: 'targetName',
      key: 'targetName',
      render: (name, record) => name || (record.targetId ? record.targetId : '-'),
    },
    {
      title: '限制',
      key: 'limits',
      render: (_, record) => (
        <span style={{ fontSize: 12 }}>{formatLimitDisplay(record)}</span>
      ),
    },
    {
      title: '启用状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggle(record)}
          loading={enableMutation.isPending || disableMutation.isPending}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此限流规则？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>限流管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRateLimit(null)
            setModalVisible(true)
          }}
        >
          添加限流规则
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={rateLimits}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingRateLimit ? '编辑限流规则' : '添加限流规则'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <RateLimitForm
          initialValues={editingRateLimit || undefined}
          onSuccess={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  )
}

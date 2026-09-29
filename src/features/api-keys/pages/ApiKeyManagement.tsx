import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm, Tag, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined, KeyOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import dayjs from 'dayjs'
import { useConsumerApiKeys, useCreateApiKey, useRevokeApiKey } from '../hooks/useApiKeys'
import ApiKeyGenerate from '../components/ApiKeyGenerate'
import type { ApiKey, ApiKeyFormData } from '@/types/model'

interface ApiKeyManagementProps {
  consumerId: string
  consumerName?: string
}

export default function ApiKeyManagement({ consumerId, consumerName }: ApiKeyManagementProps) {
  const [generateModalVisible, setGenerateModalVisible] = useState(false)
  const [revokeModalVisible, setRevokeModalVisible] = useState(false)
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)

  const { data: apiKeys, isLoading, refetch } = useConsumerApiKeys(consumerId)
  const createMutation = useCreateApiKey()
  const revokeMutation = useRevokeApiKey()

  const handleCreate = async (data: ApiKeyFormData): Promise<{ rawKey: string }> => {
    const result = await createMutation.mutateAsync({ consumerId, data })
    return { rawKey: result.rawKey }
  }

  const handleRevoke = async () => {
    if (!selectedKey) return
    try {
      await revokeMutation.mutateAsync(selectedKey.id)
      message.success('API Key 已撤销')
      setRevokeModalVisible(false)
      setSelectedKey(null)
    } catch {
      message.error('撤销失败')
    }
  }

  const openRevokeModal = (key: ApiKey) => {
    setSelectedKey(key)
    setRevokeModalVisible(true)
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '-'
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }

  const columns: Columns<ApiKey> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Key 前缀',
      dataIndex: 'keyPrefix',
      key: 'keyPrefix',
      render: (prefix: string) => (
        <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{prefix}</code>
      ),
    },
    {
      title: '权限范围',
      dataIndex: 'scopes',
      key: 'scopes',
      render: (scopes: string[]) => (
        <Space size={[0, 4]} wrap>
          {scopes.map((scope) => (
            <Tag key={scope}>{scope}</Tag>
          ))}
          {scopes.length === 0 && '-'}
        </Space>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (expiresAt?: number) => {
        if (!expiresAt) return <Tag color="green">永不过期</Tag>
        const isExpired = expiresAt < Date.now()
        return (
          <Tooltip title={formatDate(expiresAt)}>
            <Tag color={isExpired ? 'red' : 'blue'} icon={<ClockCircleOutlined />}>
              {isExpired ? '已过期' : dayjs(expiresAt).fromNow()}
            </Tag>
          </Tooltip>
        )
      },
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (lastUsedAt?: number) => {
        if (!lastUsedAt) return <span style={{ color: '#999' }}>从未使用</span>
        return <Tooltip title={formatDate(lastUsedAt)}>{dayjs(lastUsedAt).fromNow()}</Tooltip>
      },
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>{isActive ? '正常' : '已撤销'}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: number) => formatDate(createdAt),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="确定撤销此 API Key？"
          description="撤销后，使用此 Key 的请求将无法通过认证。"
          onConfirm={() => openRevokeModal(record)}
          okText="确定撤销"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger icon={<DeleteOutlined />} disabled={!record.isActive}>
            撤销
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>
          <KeyOutlined style={{ marginRight: 8 }} />
          API Key 管理
          {consumerName && <span style={{ fontSize: 14, color: '#666', marginLeft: 8 }}>（{consumerName}）</span>}
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setGenerateModalVisible(true)}
        >
          生成 API Key
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={apiKeys}
        rowKey="id"
        loading={isLoading}
        locale={{ emptyText: '暂无 API Key，请点击上方按钮生成' }}
      />

      <ApiKeyGenerate
        open={generateModalVisible}
        onCancel={() => setGenerateModalVisible(false)}
        onSuccess={() => {
          setGenerateModalVisible(false)
          refetch()
        }}
        consumerId={consumerId}
        onCreate={handleCreate}
      />

      <Modal
        title="撤销 API Key"
        open={revokeModalVisible}
        onCancel={() => {
          setRevokeModalVisible(false)
          setSelectedKey(null)
        }}
        onOk={handleRevoke}
        okText="确定撤销"
        cancelText="取消"
        okButtonProps={{ danger: true, loading: revokeMutation.isPending }}
      >
        <p>
          确定要撤销 API Key <strong>{selectedKey?.name}</strong> 吗？
        </p>
        <p style={{ color: '#666' }}>撤销后，使用此 Key 的请求将无法通过认证，此操作不可恢复。</p>
      </Modal>
    </div>
  )
}

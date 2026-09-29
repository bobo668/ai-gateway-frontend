import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Table, Button, Space, message, Popconfirm } from 'antd'
import { DeleteOutlined, PlusOutlined, KeyOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import DetailPanel from '@/components/DetailPanel'
import QuotaUsage from '../components/QuotaUsage'
import { useConsumer, useConsumerApiKeys, useRevokeApiKey } from '../hooks/useConsumers'
import type { ApiKey } from '@/types/model'

const consumerTypeMap: Record<string, string> = {
  TEAM: '团队',
  APPLICATION: '应用',
  INDIVIDUAL: '个人',
}

export default function ConsumerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: consumer, isLoading } = useConsumer(id!)
  const { data: apiKeys } = useConsumerApiKeys(id!)
  const revokeMutation = useRevokeApiKey()

  if (!consumer) {
    return null
  }

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeMutation.mutateAsync(keyId)
      message.success('API Key已吊销')
    } catch {
      message.error('吊销失败')
    }
  }

  const apiKeyColumns: Columns<ApiKey> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Key前缀',
      dataIndex: 'keyPrefix',
      key: 'keyPrefix',
      render: (prefix: string) => <code>{prefix}****</code>,
    },
    {
      title: '权限范围',
      dataIndex: 'scopes',
      key: 'scopes',
      render: (scopes: string[]) => (
        <>
          {scopes.map((scope) => (
            <Tag key={scope} style={{ marginRight: 4 }}>
              {scope}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'}>{active ? '激活' : '已吊销'}</Tag>
      ),
    },
    {
      title: '最后使用',
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (timestamp?: number) =>
        timestamp ? new Date(timestamp).toLocaleString('zh-CN') : '从未使用',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) =>
        record.isActive ? (
          <Popconfirm
            title="确定吊销此API Key？"
            description="吊销后使用此Key的请求将被拒绝"
            onConfirm={() => handleRevokeKey(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              吊销
            </Button>
          </Popconfirm>
        ) : null,
    },
  ]

  const sections = [
    {
      title: '基本信息',
      fields: [
        { label: '消费者名称', value: consumer.name },
        {
          label: '消费者类型',
          value: consumerTypeMap[consumer.consumerType] || consumer.consumerType,
        },
        {
          label: '配额使用',
          value: (
            <QuotaUsage
              consumerId={consumer.id}
              quota={consumer.quota}
              usedQuota={consumer.usedQuota}
              alertThreshold={consumer.alertThreshold}
              showDetails
            />
          ),
        },
        {
          label: '启用状态',
          value: consumer.isEnabled ? '已启用' : '已禁用',
        },
      ],
    },
    {
      title: '时间信息',
      fields: [
        {
          label: '创建时间',
          value: new Date(consumer.createdAt).toLocaleString('zh-CN'),
        },
        {
          label: '更新时间',
          value: new Date(consumer.updatedAt).toLocaleString('zh-CN'),
        },
      ],
    },
  ]

  return (
    <div>
      <DetailPanel
        title="消费者详情"
        sections={sections}
        loading={isLoading}
        onBack={() => navigate('/consumers')}
        status={
          consumer.isEnabled
            ? { text: '已启用', color: 'success' }
            : { text: '已禁用', color: 'default' }
        }
      />

      <div style={{ marginTop: 16 }}>
        <DetailPanel
          title="API Keys"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/consumers/${id}/api-keys`)}
            >
              管理API Keys
            </Button>
          }
        >
          <Table
            columns={apiKeyColumns}
            dataSource={apiKeys || []}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: '暂无API Key，点击"管理API Keys"创建' }}
          />
        </DetailPanel>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import { useConsumers, useDeleteConsumer } from '../hooks/useConsumers'
import ConsumerForm from '../components/ConsumerForm'
import QuotaUsage from '../components/QuotaUsage'
import type { Consumer } from '@/types/model'

export default function ConsumerListPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingConsumer, setEditingConsumer] = useState<Consumer | null>(null)

  const { data: consumers, isLoading } = useConsumers()
  const deleteMutation = useDeleteConsumer()

  const handleEdit = (record: Consumer) => {
    setEditingConsumer(record)
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

  const getConsumerTypeTag = (type: Consumer['consumerType']) => {
    const colorMap: Record<Consumer['consumerType'], string> = {
      TEAM: 'blue',
      APPLICATION: 'green',
      INDIVIDUAL: 'orange',
    }
    const labelMap: Record<Consumer['consumerType'], string> = {
      TEAM: '团队',
      APPLICATION: '应用',
      INDIVIDUAL: '个人',
    }
    return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>
  }

  const columns: Columns<Consumer> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'consumerType',
      key: 'consumerType',
      render: (type: Consumer['consumerType']) => getConsumerTypeTag(type),
    },
    {
      title: '配额使用',
      key: 'quotaUsage',
      render: (_, record) => (
        <QuotaUsage
          consumerId={record.id}
          quota={record.quota}
          usedQuota={record.usedQuota}
          alertThreshold={record.alertThreshold}
          showDetails
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? '已启用' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN'),
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
            title="确定删除此消费者？"
            description="删除后将无法恢复，相关策略和API Key也将被移除"
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
        <h2 style={{ margin: 0, fontSize: 20 }}>消费者管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingConsumer(null)
            setModalVisible(true)
          }}
        >
          添加消费者
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={consumers}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingConsumer ? '编辑消费者' : '添加消费者'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <ConsumerForm
          initialValues={editingConsumer || undefined}
          onSuccess={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  )
}

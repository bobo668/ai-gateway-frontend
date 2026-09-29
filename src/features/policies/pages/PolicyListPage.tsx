import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import { usePolicies, useDeletePolicy } from '../hooks/usePolicies'
import PolicyForm from '../components/PolicyForm'
import PolicyPriority from '../components/PolicyPriority'
import type { Policy } from '@/types/model'

export default function PolicyListPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [priorityModalVisible, setPriorityModalVisible] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  const { data: policies, isLoading } = usePolicies()
  const deleteMutation = useDeletePolicy()

  const handleEdit = (record: Policy) => {
    setEditingPolicy(record)
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

  const columns: Columns<Policy> = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '消费者',
      dataIndex: 'consumerName',
      key: 'consumerName',
      render: (name, record) => name || record.consumerId,
    },
    {
      title: '服务商',
      dataIndex: 'providerName',
      key: 'providerName',
      render: (name, record) => name || record.providerId,
    },
    {
      title: '允许的能力',
      dataIndex: 'capabilities',
      key: 'capabilities',
      render: (capabilities: string[]) => (
        <>
          {capabilities.map((cap) => (
            <Tag key={cap} color="blue">{cap}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '模型限制',
      dataIndex: 'modelRestrictions',
      key: 'modelRestrictions',
      render: (restrictions: string[]) => (
        restrictions.length > 0 ? (
          restrictions.map((model) => (
            <Tag key={model}>{model}</Tag>
          ))
        ) : (
          <Tag>全部</Tag>
        )
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '允许访问',
      dataIndex: 'isAllowed',
      key: 'isAllowed',
      render: (allowed) => (
        <Tag color={allowed ? 'success' : 'error'}>
          {allowed ? '是' : '否'}
        </Tag>
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
            title="确定删除此策略？"
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
        <h2 style={{ margin: 0, fontSize: 20 }}>访问策略管理</h2>
        <Space>
          <Button onClick={() => setPriorityModalVisible(true)}>
            优先级设置
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPolicy(null)
              setModalVisible(true)
            }}
          >
            添加策略
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={policies}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingPolicy ? '编辑策略' : '添加策略'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <PolicyForm
          initialValues={editingPolicy || undefined}
          onSuccess={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      <Modal
        title="优先级设置"
        open={priorityModalVisible}
        onCancel={() => setPriorityModalVisible(false)}
        footer={null}
        width={500}
      >
        <PolicyPriority />
      </Modal>
    </div>
  )
}

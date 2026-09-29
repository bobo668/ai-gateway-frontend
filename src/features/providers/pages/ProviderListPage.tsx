import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import { useProviders, useDeleteProvider, useTestConnection } from '../hooks/useProviders'
import ProviderStatus from '../components/ProviderStatus'
import ProviderForm from '../components/ProviderForm'
import type { Provider } from '@/types/model'

export default function ProviderListPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)

  const { data: providers, isLoading } = useProviders()
  const deleteMutation = useDeleteProvider()
  const testMutation = useTestConnection()

  const handleEdit = (record: Provider) => {
    setEditingProvider(record)
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

  const handleTest = async (id: string) => {
    try {
      const result = await testMutation.mutateAsync(id)
      if (result.success) {
        message.success('连接测试成功')
      } else {
        message.error(result.message || '连接测试失败')
      }
    } catch {
      message.error('连接测试失败')
    }
  }

  const columns: Columns<Provider> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'providerType',
      key: 'providerType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <ProviderStatus status={status} />,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: '故障转移',
      dataIndex: 'failoverEnabled',
      key: 'failoverEnabled',
      render: (enabled) => (enabled ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleTest(record.id)}>
            测试
          </Button>
          <Popconfirm
            title="确定删除此服务商？"
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
        <h2 style={{ margin: 0, fontSize: 20 }}>服务商管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProvider(null)
            setModalVisible(true)
          }}
        >
          添加服务商
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={providers}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingProvider ? '编辑服务商' : '添加服务商'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <ProviderForm
          initialValues={editingProvider || undefined}
          onSuccess={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  )
}

import { useState } from 'react'
import { Table, Button, Space, Modal, message, Popconfirm, Tabs, Drawer } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import { useMcpServers, useDeleteMcpServer } from '../hooks/useMcpServers'
import McpServerForm from '../components/McpServerForm'
import McpConnectionStatus from '../components/McpConnectionStatus'
import McpToolList from '../components/McpToolList'
import { formatDate } from '@/utils/format'
import type { McpServer } from '@/types/model'

export default function McpServerListPage() {
  const [modalVisible, setModalVisible] = useState(false)
  const [editingServer, setEditingServer] = useState<McpServer | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null)

  const { data: servers, isLoading } = useMcpServers()
  const deleteMutation = useDeleteMcpServer()

  const handleEdit = (record: McpServer) => {
    setEditingServer(record)
    setModalVisible(true)
  }

  const handleViewTools = (record: McpServer) => {
    setSelectedServer(record)
    setDrawerVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      message.success('删除成功')
    } catch {
      message.error('删除失败')
    }
  }

  const columns: Columns<McpServer> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '端点',
      dataIndex: 'endpoint',
      key: 'endpoint',
      ellipsis: true,
    },
    {
      title: '协议版本',
      dataIndex: 'protocolVersion',
      key: 'protocolVersion',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <McpConnectionStatus status={status} />,
    },
    {
      title: '启用',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      width: 80,
      render: (enabled) => (enabled ? '是' : '否'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (ts) => formatDate(ts),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<ToolOutlined />} onClick={() => handleViewTools(record)}>
            工具
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此 MCP 服务器？"
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

  const tabItems = selectedServer
    ? [
        {
          key: 'tools',
          label: '工具列表',
          children: <McpToolList serverId={selectedServer.id} serverName={selectedServer.name} />,
        },
      ]
    : []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>MCP 服务器管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingServer(null)
            setModalVisible(true)
          }}
        >
          添加服务器
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={servers}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingServer ? '编辑 MCP 服务器' : '添加 MCP 服务器'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <McpServerForm
          initialValues={editingServer || undefined}
          onSuccess={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>

      <Drawer
        title={`${selectedServer?.name || ''} - 工具列表`}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={800}
      >
        <Tabs items={tabItems} />
      </Drawer>
    </div>
  )
}

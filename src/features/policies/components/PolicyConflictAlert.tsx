import { Alert, Table, Typography, Space, Tag } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'

const { Text } = Typography

interface ConflictInfo {
  id: string
  policy1Name: string
  policy2Name: string
  conflictType: 'SAME_CONSUMER_PROVIDER' | 'OVERLAPPING_SCOPE' | 'PRIORITY_CONFLICT'
  description: string
  suggestion: string
}

interface PolicyConflictAlertProps {
  conflicts: ConflictInfo[]
  onViewPolicy?: (policyId: string) => void
}

const conflictTypeMap: Record<ConflictInfo['conflictType'], { color: string; text: string }> = {
  SAME_CONSUMER_PROVIDER: { color: 'red', text: '相同消费者-服务商组合' },
  OVERLAPPING_SCOPE: { color: 'orange', text: '范围重叠' },
  PRIORITY_CONFLICT: { color: 'yellow', text: '优先级冲突' },
}

export default function PolicyConflictAlert({ conflicts, onViewPolicy }: PolicyConflictAlertProps) {
  if (!conflicts || conflicts.length === 0) {
    return null
  }

  const columns: Columns<ConflictInfo> = [
    {
      title: '冲突策略',
      key: 'policies',
      render: (_, record) => (
        <Space>
          <Tag color="blue">{record.policy1Name}</Tag>
          <span>与</span>
          <Tag color="blue">{record.policy2Name}</Tag>
        </Space>
      ),
    },
    {
      title: '冲突类型',
      dataIndex: 'conflictType',
      key: 'conflictType',
      render: (type: ConflictInfo['conflictType']) => {
        const config = conflictTypeMap[type]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '建议',
      dataIndex: 'suggestion',
      key: 'suggestion',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
  ]

  return (
    <Alert
      type="warning"
      icon={<WarningOutlined />}
      message={`检测到 ${conflicts.length} 个策略冲突`}
      description={
        <Table
          columns={columns}
          dataSource={conflicts}
          rowKey="id"
          pagination={false}
          size="small"
          style={{ marginTop: 12 }}
        />
      }
      style={{ marginBottom: 16 }}
      showIcon
    />
  )
}

export type { ConflictInfo }

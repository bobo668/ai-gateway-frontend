import { Card, Descriptions, DescriptionsProps, Space, Button, Tag, Divider } from 'antd'
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons'

export interface DetailField {
  label: string
  value: React.ReactNode
  span?: 1 | 2 | 3
  render?: (value: React.ReactNode) => React.ReactNode
}

export interface DetailSection {
  title?: string
  fields: DetailField[]
}

export interface DetailPanelProps {
  title?: React.ReactNode
  subtitle?: string
  sections: DetailSection[]
  loading?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
  editText?: string
  deleteText?: string
  extra?: React.ReactNode
  status?: {
    text: string
    color?: string
  }
}

export default function DetailPanel({
  title,
  subtitle,
  sections,
  loading = false,
  onEdit,
  onDelete,
  onBack,
  editText = '编辑',
  deleteText = '删除',
  extra,
  status,
}: DetailPanelProps) {
  const renderItems = (fields: DetailField[]): DescriptionsProps['items'] => {
    return fields.map((field) => ({
      key: field.label,
      label: field.label,
      children: field.render ? field.render(field.value) : field.value,
      span: field.span || 1,
    }))
  }

  return (
    <Card
      loading={loading}
      title={
        <Space>
          {onBack && (
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} size="small" />
          )}
          {title}
          {status && (
            <Tag color={status.color || 'default'} style={{ marginLeft: 8 }}>
              {status.text}
            </Tag>
          )}
        </Space>
      }
      extra={
        <Space>
          {extra}
          {onEdit && (
            <Button icon={<EditOutlined />} onClick={onEdit}>
              {editText}
            </Button>
          )}
          {onDelete && (
            <Button icon={<DeleteOutlined />} danger onClick={onDelete}>
              {deleteText}
            </Button>
          )}
        </Space>
      }
    >
      {subtitle && (
        <>
          <p style={{ color: '#666', marginBottom: 16 }}>{subtitle}</p>
          <Divider style={{ margin: '16px 0' }} />
        </>
      )}
      {sections.map((section, index) => (
        <div key={index}>
          {section.title && (
            <h4 style={{ marginBottom: 12, color: '#333' }}>{section.title}</h4>
          )}
          <Descriptions
            column={{ xs: 1, sm: 2, md: 3 }}
            items={renderItems(section.fields)}
            size="small"
          />
          {index < sections.length - 1 && <Divider />}
        </div>
      ))}
    </Card>
  )
}

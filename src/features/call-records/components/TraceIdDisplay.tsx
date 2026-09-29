import { Typography, Button, Space, message } from 'antd'
import { CopyOutlined, LinkOutlined } from '@ant-design/icons'

const { Text } = Typography

interface TraceIdDisplayProps {
  traceId: string
  copyable?: boolean
  onClick?: () => void
}

export default function TraceIdDisplay({ traceId, copyable = true, onClick }: TraceIdDisplayProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(traceId)
      message.success('TraceId已复制')
    } catch {
      message.error('复制失败')
    }
  }

  const displayTraceId = traceId.length > 20 ? `${traceId.slice(0, 8)}...${traceId.slice(-8)}` : traceId

  return (
    <Space>
      <Text
        code
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
        title={traceId}
      >
        {displayTraceId}
      </Text>
      {copyable && (
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
        />
      )}
      {onClick && (
        <Button
          type="text"
          size="small"
          icon={<LinkOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        />
      )}
    </Space>
  )
}

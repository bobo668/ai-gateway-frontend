import { Badge, Tooltip } from 'antd'
import type { McpServer } from '@/types/model'

interface McpConnectionStatusProps {
  status?: McpServer['status']
  showText?: boolean
}

const statusMap = {
  CONNECTED: { color: 'green', text: '已连接' },
  DISCONNECTED: { color: 'gray', text: '已断开' },
  ERROR: { color: 'red', text: '错误' },
}

export default function McpConnectionStatus({ status, showText = true }: McpConnectionStatusProps) {
  const config = statusMap[status || 'DISCONNECTED']

  return (
    <Tooltip title={`当前状态: ${config.text}`}>
      <Badge status={config.color as 'success' | 'default' | 'error'} />
      {showText && <span style={{ marginLeft: 8 }}>{config.text}</span>}
    </Tooltip>
  )
}

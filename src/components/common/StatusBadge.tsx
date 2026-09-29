import { Tag } from 'antd'

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default' | 'processing'

interface StatusBadgeProps {
  status: string
  statusText?: string
  statusType?: StatusType
}

const defaultStatusMap: Record<string, { type: StatusType; text: string }> = {
  HEALTHY: { type: 'success', text: '健康' },
  UNHEALTHY: { type: 'error', text: '异常' },
  UNKNOWN: { type: 'default', text: '未知' },
  CONNECTED: { type: 'success', text: '已连接' },
  DISCONNECTED: { type: 'error', text: '已断开' },
  ERROR: { type: 'error', text: '错误' },
  SUCCESS: { type: 'success', text: '成功' },
  FAILED: { type: 'error', text: '失败' },
  RATE_LIMITED: { type: 'warning', text: '限流' },
  ENABLED: { type: 'success', text: '已启用' },
  DISABLED: { type: 'default', text: '已禁用' },
  ACTIVE: { type: 'processing', text: '活跃' },
  INACTIVE: { type: 'default', text: '未激活' },
}

export default function StatusBadge({ status, statusText, statusType }: StatusBadgeProps) {
  const config = defaultStatusMap[status.toUpperCase()] || { type: 'default' as StatusType, text: status }
  const type = statusType || config.type
  const text = statusText || config.text

  return <Tag color={type}>{text}</Tag>
}

import { Tag } from 'antd'

interface ProviderStatusProps {
  status?: 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN'
}

export default function ProviderStatus({ status }: ProviderStatusProps) {
  const statusMap = {
    HEALTHY: { color: 'green', text: '健康' },
    UNHEALTHY: { color: 'red', text: '异常' },
    UNKNOWN: { color: 'default', text: '未知' },
  }

  const config = status ? statusMap[status] : statusMap.UNKNOWN

  return <Tag color={config.color}>{config.text}</Tag>
}

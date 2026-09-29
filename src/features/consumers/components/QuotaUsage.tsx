import { Progress, Tooltip } from 'antd'
import { useConsumerUsage } from '../hooks/useConsumers'

interface QuotaUsageProps {
  consumerId: string
  quota: number
  usedQuota: number
  alertThreshold: number
  period?: string
  showDetails?: boolean
}

export default function QuotaUsage({
  consumerId,
  quota,
  usedQuota,
  alertThreshold,
  period,
  showDetails = false,
}: QuotaUsageProps) {
  const { data: usageData, isLoading } = useConsumerUsage(consumerId, period)

  const used = usageData?.used ?? usedQuota
  const total = usageData?.total ?? quota
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const isOverThreshold = percentage >= alertThreshold
  const isOverQuota = used >= total

  const getProgressColor = () => {
    if (isOverQuota) return '#ff4d4f'
    if (isOverThreshold) return '#faad14'
    return '#52c41a'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div style={{ width: '100%' }}>
      <Tooltip title={`已使用: ${formatNumber(used)} / ${formatNumber(total)}`}>
        <Progress
          percent={percentage}
          success={{ percent: 0 }}
          strokeColor={getProgressColor()}
          trailColor="#f0f0f0"
          showInfo={!showDetails}
          size="small"
        />
      </Tooltip>
      {showDetails && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          <div>已使用: {formatNumber(used)}</div>
          <div>总额度: {formatNumber(total)}</div>
          <div style={{ color: isOverThreshold ? '#faad14' : '#999' }}>
            告警阈值: {alertThreshold}%
          </div>
        </div>
      )}
    </div>
  )
}

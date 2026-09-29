import { Progress } from 'antd'

interface BudgetProgressProps {
  used: number
  total: number
  threshold?: number
  consumerName?: string
}

export default function BudgetProgress({ used, total, threshold = 80, consumerName }: BudgetProgressProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0
  const isOverThreshold = percentage >= threshold
  const isOverBudget = percentage >= 100

  let status: 'success' | 'normal' | 'exception' = 'normal'
  if (isOverBudget) status = 'exception'
  else if (isOverThreshold) status = 'exception'
  else if (percentage < 50) status = 'success'

  const color = isOverBudget ? '#ff4d4f' : isOverThreshold ? '#faad14' : '#52c41a'

  return (
    <div style={{ width: '100%' }}>
      {consumerName && <div style={{ marginBottom: 8 }}>{consumerName}</div>}
      <Progress
        percent={Math.min(percentage, 100)}
        status={status}
        strokeColor={color}
        format={() => `${used.toFixed(0)} / ${total.toFixed(0)} (${percentage.toFixed(1)}%)`}
      />
    </div>
  )
}

import { Select, Space } from 'antd'

interface TimeRangeSelectorProps {
  value?: string
  onChange?: (value: string) => void
}

const options = [
  { value: '1h', label: '最近1小时' },
  { value: '6h', label: '最近6小时' },
  { value: '24h', label: '最近24小时' },
  { value: '7d', label: '最近7天' },
  { value: '30d', label: '最近30天' },
]

export default function TimeRangeSelector({ value = '1h', onChange }: TimeRangeSelectorProps) {
  return (
    <Space>
      <span>时间范围:</span>
      <Select value={value} onChange={onChange} options={options} style={{ width: 120 }} />
    </Space>
  )
}

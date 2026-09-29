import { InputNumber, Slider, Card, Typography } from 'antd'

const { Text } = Typography

interface PolicyPriorityProps {
  value?: number
  onChange?: (value: number) => void
  disabled?: boolean
}

export default function PolicyPriority({ value = 100, onChange, disabled = false }: PolicyPriorityProps) {
  const handleSliderChange = (newValue: number) => {
    onChange?.(newValue)
  }

  const handleInputChange = (newValue: number | null) => {
    if (newValue !== null) {
      onChange?.(newValue)
    }
  }

  return (
    <Card size="small" title="优先级设置">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Slider
            min={1}
            max={1000}
            value={value}
            onChange={handleSliderChange}
            disabled={disabled}
            marks={{
              1: '低',
              500: '中',
              1000: '高',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>优先级数值:</Text>
          <InputNumber
            min={1}
            max={1000}
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            style={{ width: 100 }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            数值越高，优先级越高
          </Text>
        </div>
      </div>
    </Card>
  )
}

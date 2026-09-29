import { Form, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'

interface CostFiltersProps {
  value?: { consumerId?: string; providerId?: string; startMonth?: string; endMonth?: string }
  onChange?: (values: { consumerId?: string; providerId?: string; startMonth?: string; endMonth?: string }) => void
  consumers?: { id: string; name: string }[]
  providers?: { id: string; name: string }[]
}

const { RangePicker } = DatePicker

export default function CostFilters({ value, onChange, consumers = [], providers = [] }: CostFiltersProps) {
  return (
    <Form layout="inline" initialValues={value} onValuesChange={(_, allValues) => onChange?.(allValues)}>
      <Form.Item name="consumerId" label="消费者">
        <Select allowClear placeholder="全部消费者" style={{ width: 150 }} options={consumers.map((c) => ({ value: c.id, label: c.name }))} />
      </Form.Item>
      <Form.Item name="providerId" label="服务商">
        <Select allowClear placeholder="全部服务商" style={{ width: 150 }} options={providers.map((p) => ({ value: p.id, label: p.name }))} />
      </Form.Item>
      <Form.Item name="monthRange" label="月份范围">
        <RangePicker picker="month" format="YYYY-MM" />
      </Form.Item>
    </Form>
  )
}

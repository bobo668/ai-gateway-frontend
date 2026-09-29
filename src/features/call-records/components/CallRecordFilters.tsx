import { Form, Select, DatePicker, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { CallRecordQuery, CallStatus } from '@/types/model'
import type { Consumer } from '@/types/model'
import type { Provider } from '@/types/model'

const { RangePicker } = DatePicker

interface CallRecordFiltersProps {
  filters: CallRecordQuery
  onFilterChange: (filters: CallRecordQuery) => void
  consumers?: Consumer[]
  providers?: Provider[]
  loading?: boolean
}

const statusOptions = [
  { value: 'SUCCESS', label: '成功' },
  { value: 'FAILED', label: '失败' },
  { value: 'RATE_LIMITED', label: '限流' },
  { value: 'ERROR', label: '错误' },
]

export default function CallRecordFilters({
  filters,
  onFilterChange,
  consumers,
  providers,
  loading,
}: CallRecordFiltersProps) {
  const [form] = Form.useForm()

  const handleValuesChange = (_: unknown, values: Record<string, unknown>) => {
    const newFilters: CallRecordQuery = {
      ...filters,
      page: 1,
    }

    if (values.consumerId) {
      newFilters.consumerId = values.consumerId as string
    } else {
      delete newFilters.consumerId
    }

    if (values.providerId) {
      newFilters.providerId = values.providerId as string
    } else {
      delete newFilters.providerId
    }

    if (values.status) {
      newFilters.status = values.status as CallStatus
    } else {
      delete newFilters.status
    }

    if (values.timeRange && values.timeRange.length === 2) {
      newFilters.startTime = values.timeRange[0].startOf('day').valueOf()
      newFilters.endTime = values.timeRange[1].endOf('day').valueOf()
    } else {
      delete newFilters.startTime
      delete newFilters.endTime
    }

    onFilterChange(newFilters)
  }

  const handleReset = () => {
    form.resetFields()
    onFilterChange({})
  }

  const consumerOptions = consumers?.map((c) => ({ value: c.id, label: c.name })) || []
  const providerOptions = providers?.map((p) => ({ value: p.id, label: p.name })) || []

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{
        consumerId: filters.consumerId,
        providerId: filters.providerId,
        status: filters.status,
        timeRange: filters.startTime && filters.endTime
          ? [dayjs(filters.startTime), dayjs(filters.endTime)]
          : undefined,
      }}
      onValuesChange={handleValuesChange}
      style={{ marginBottom: 16 }}
    >
      <Form.Item name="consumerId" label="消费者" style={{ marginBottom: 8 }}>
        <Select
          allowClear
          placeholder="选择消费者"
          options={consumerOptions}
          style={{ width: 180 }}
          loading={loading}
        />
      </Form.Item>

      <Form.Item name="providerId" label="服务商" style={{ marginBottom: 8 }}>
        <Select
          allowClear
          placeholder="选择服务商"
          options={providerOptions}
          style={{ width: 180 }}
          loading={loading}
        />
      </Form.Item>

      <Form.Item name="status" label="状态" style={{ marginBottom: 8 }}>
        <Select
          allowClear
          placeholder="选择状态"
          options={statusOptions}
          style={{ width: 120 }}
        />
      </Form.Item>

      <Form.Item name="timeRange" label="时间范围" style={{ marginBottom: 8 }}>
        <RangePicker />
      </Form.Item>

      <Form.Item style={{ marginBottom: 8 }}>
        <Space>
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

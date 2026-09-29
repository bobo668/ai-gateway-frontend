import { Drawer, Descriptions, Tag, Alert, Spin } from 'antd'
import { formatDate, formatDuration } from '@/utils/format'
import type { CallRecord } from '@/types/model'

interface CallRecordDetailDrawerProps {
  visible: boolean
  record: CallRecord | null
  loading?: boolean
  onClose: () => void
}

const statusColorMap: Record<string, string> = {
  SUCCESS: 'green',
  FAILED: 'red',
  RATE_LIMITED: 'orange',
  ERROR: 'red',
}

const statusTextMap: Record<string, string> = {
  SUCCESS: '成功',
  FAILED: '失败',
  RATE_LIMITED: '限流',
  ERROR: '错误',
}

export default function CallRecordDetailDrawer({
  visible,
  record,
  loading,
  onClose,
}: CallRecordDetailDrawerProps) {
  if (!record) {
    return (
      <Drawer
        title="调用详情"
        open={visible}
        onClose={onClose}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      </Drawer>
    )
  }

  return (
    <Drawer
      title="调用详情"
      open={visible}
      onClose={onClose}
      width={600}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="记录ID">{record.id}</Descriptions.Item>
        <Descriptions.Item label="Trace ID">{record.traceId}</Descriptions.Item>
        <Descriptions.Item label="消费者">
          {record.consumerName || record.consumerId}
        </Descriptions.Item>
        <Descriptions.Item label="服务商">
          {record.providerName || record.providerId}
        </Descriptions.Item>
        <Descriptions.Item label="模型">{record.model}</Descriptions.Item>
        <Descriptions.Item label="能力">{record.capability}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusColorMap[record.status]}>
            {statusTextMap[record.status]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Prompt Tokens">{record.promptTokens}</Descriptions.Item>
        <Descriptions.Item label="Completion Tokens">{record.completionTokens}</Descriptions.Item>
        <Descriptions.Item label="Total Tokens">{record.totalTokens}</Descriptions.Item>
        <Descriptions.Item label="延迟">{formatDuration(record.latency)}</Descriptions.Item>
        <Descriptions.Item label="时间">{formatDate(record.timestamp)}</Descriptions.Item>
      </Descriptions>

      {(record.errorCode || record.errorMessage) && (
        <Alert
          type="error"
          message={record.errorCode && <span>错误代码: {record.errorCode}</span>}
          description={record.errorMessage}
          style={{ marginTop: 16 }}
          showIcon
        />
      )}
    </Drawer>
  )
}

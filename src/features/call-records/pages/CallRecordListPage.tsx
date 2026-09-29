import { useState, useMemo } from 'react'
import { Table, Button, Space, Tag, message, Pagination } from 'antd'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import type { Columns } from 'antd/es/table'
import { useCallRecords } from '../hooks/useCallRecords'
import { useProviders } from '@/features/providers/hooks/useProviders'
import CallRecordFilters from '../components/CallRecordFilters'
import CallRecordDetailDrawer from '../components/CallRecordDetailDrawer'
import { exportCallRecordsToCSV } from '../utils/export'
import { formatDate, formatDuration } from '@/utils/format'
import type { CallRecord, CallRecordQuery } from '@/types/model'

const pageSize = 20

export default function CallRecordListPage() {
  const [filters, setFilters] = useState<CallRecordQuery>({
    page: 1,
    pageSize,
  })
  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const { data, isLoading } = useCallRecords(filters)
  const { data: providers } = useProviders()

  const records = data?.data || []
  const total = data?.total || 0

  const handleFilterChange = (newFilters: CallRecordQuery) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }

  const handlePageChange = (page: number, size: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
      pageSize: size,
    }))
  }

  const handleViewDetail = (record: CallRecord) => {
    setSelectedRecord(record)
    setDrawerVisible(true)
  }

  const handleExport = () => {
    try {
      exportCallRecordsToCSV(records)
      message.success('导出成功')
    } catch {
      message.error('导出失败')
    }
  }

  const statusColorMap: Record<string, string> = {
    SUCCESS: 'green',
    FAILED: 'red',
    RATE_LIMITED: 'orange',
    ERROR: 'red',
  }

  const columns: Columns<CallRecord> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (ts) => formatDate(ts),
    },
    {
      title: '消费者',
      dataIndex: 'consumerName',
      key: 'consumerName',
      width: 120,
      render: (_, record) => record.consumerName || record.consumerId,
    },
    {
      title: '服务商',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 120,
      render: (_, record) => record.providerName || record.providerId,
    },
    {
      title: '模型',
      dataIndex: 'model',
      key: 'model',
      width: 120,
    },
    {
      title: '能力',
      dataIndex: 'capability',
      key: 'capability',
      width: 100,
    },
    {
      title: 'Tokens',
      key: 'tokens',
      width: 140,
      render: (_, record) => (
        <span>
          {record.promptTokens} / {record.completionTokens} / {record.totalTokens}
        </span>
      ),
    },
    {
      title: '延迟',
      dataIndex: 'latency',
      key: 'latency',
      width: 100,
      render: (lat) => formatDuration(lat),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={statusColorMap[status]}>
          {status === 'SUCCESS' ? '成功' : status === 'FAILED' ? '失败' : status === 'RATE_LIMITED' ? '限流' : '错误'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>调用记录</h2>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出 CSV
        </Button>
      </div>

      <CallRecordFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        providers={providers}
        loading={isLoading}
      />

      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        scroll={{ x: 1200 }}
      />

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={filters.page}
          pageSize={filters.pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>

      <CallRecordDetailDrawer
        visible={drawerVisible}
        record={selectedRecord}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  )
}

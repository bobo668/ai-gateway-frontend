import React, { useState } from 'react'
import { Table, TableProps, Card, Space, Button, Input } from 'antd'
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons'

export interface EnhancedTableColumn<T> = {
  key: string
  title: string
  dataIndex?: keyof T | string[]
  sorter?: boolean | ((a: T, b: T) => number)
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  width?: number | string
  ellipsis?: boolean
  fixed?: 'left' | 'right'
  filters?: { text: string; value: string }[]
  onFilter?: (value: unknown, record: T) => boolean
}

export interface EnhancedTableProps<T> {
  columns: EnhancedTableColumn<T>[]
  dataSource: T[]
  rowKey: string | ((record: T) => string)
  loading?: boolean
  pagination?: false | {
    current?: number
    pageSize?: number
    total?: number
    onChange?: (page: number, pageSize: number) => void
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    pageSizeOptions?: string[]
  }
  onReload?: () => void
  onExport?: () => void
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (keyword: string) => void
  title?: React.ReactNode
  scroll?: { x?: number | string; y?: number | string }
  size?: 'small' | 'middle' | 'large'
  rowClassName?: string | ((record: T, index: number) => string)
  onRow?: TableProps<T>['onRow']
  responsive?: {
    breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
    hideColumns?: string[]
  }
}

export default function EnhancedTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  pagination = false,
  onReload,
  onExport,
  searchable = false,
  searchPlaceholder = '搜索...',
  onSearch,
  title,
  scroll,
  size = 'middle',
  rowClassName,
  onRow,
  responsive,
}: EnhancedTableProps<T>) {
  const [keyword, setKeyword] = useState('')

  const handleSearch = () => {
    onSearch?.(keyword)
  }

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  const paginationConfig =
    pagination === false
      ? false
      : {
          current: pagination.current || 1,
          pageSize: pagination.pageSize || 10,
          total: pagination.total || dataSource.length,
          showSizeChanger: pagination.showSizeChanger !== false,
          showQuickJumper: pagination.showQuickJumper !== false,
          pageSizeOptions: pagination.pageSizeOptions || ['10', '20', '50', '100'],
          onChange: pagination.onChange,
          showTotal: (total: number, range: [number, number]) =>
            `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }

  const tableColumns = columns.map((col) => ({
    ...col,
    ellipsis: col.ellipsis ?? true,
  }))

  return (
    <Card
      size="small"
      title={title}
      extra={
        <Space>
          {searchable && (
            <Space.Compact>
              <Input
                placeholder={searchPlaceholder}
                value={keyword}
                onChange={handleKeywordChange}
                onPressEnter={handleSearch}
                allowClear
                style={{ width: 200 }}
              />
            </Space.Compact>
          )}
          {onReload && (
            <Button icon={<ReloadOutlined />} onClick={onReload}>
              刷新
            </Button>
          )}
          {onExport && (
            <Button icon={<DownloadOutlined />} onClick={onExport}>
              导出
            </Button>
          )}
        </Space>
      }
      styles={{ body: { padding: 0 } }}
    >
      <Table<T>
        columns={tableColumns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={paginationConfig}
        scroll={scroll}
        size={size}
        rowClassName={rowClassName}
        onRow={onRow}
        scroll={{ x: scroll?.x || 'max-content', y: scroll?.y }}
      />
    </Card>
  )
}

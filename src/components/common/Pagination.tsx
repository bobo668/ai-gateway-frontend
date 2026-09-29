import { Pagination as AntPagination, Select, Space } from 'antd'

export interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
  showTotal?: boolean
  size?: 'default' | 'small'
}

export default function Pagination({
  current,
  pageSize,
  total,
  onChange,
  showSizeChanger = true,
  showQuickJumper = true,
  pageSizeOptions = ['10', '20', '50', '100'],
  showTotal = true,
  size = 'default',
}: PaginationProps) {
  return (
    <Space style={{ marginTop: 16, justifyContent: 'flex-end' }}>
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        pageSizeOptions={pageSizeOptions}
        showTotal={
          showTotal
            ? (total: number, range: [number, number]) =>
                `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`
            : undefined
        }
        size={size}
      />
    </Space>
  )
}

import { Table, Tag, Button, Modal, Form, Input, message, Space } from 'antd'
import { useState } from 'react'
import type { Columns } from 'antd/es/table'
import type { McpTool } from '@/types/model'
import { useMcpTools, useTestMcpTool } from '../hooks/useMcpServers'

interface McpToolListProps {
  serverId: string
  serverName?: string
}

export default function McpToolList({ serverId, serverName }: McpToolListProps) {
  const { data: tools, isLoading } = useMcpTools(serverId)
  const testMutation = useTestMcpTool()
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [selectedTool, setSelectedTool] = useState<McpTool | null>(null)
  const [testResult, setTestResult] = useState<string>('')

  const handleTest = (tool: McpTool) => {
    setSelectedTool(tool)
    setTestResult('')
    setTestModalVisible(true)
  }

  const handleTestSubmit = async (params: string) => {
    if (!selectedTool) return

    try {
      const parsedParams = JSON.parse(params || '{}')
      const result = await testMutation.mutateAsync({
        serverId,
        toolName: selectedTool.name,
        params: parsedParams,
      })
      setTestResult(JSON.stringify(result, null, 2))
    } catch (err) {
      setTestResult(`测试失败: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }

  const columns: Columns<McpTool> = [
    {
      title: '工具名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '输入 Schema',
      key: 'inputSchema',
      width: 300,
      render: (_, record) => (
        <Tag>{JSON.stringify(record.inputSchema).slice(0, 50)}...</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleTest(record)}>
          测试
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tools}
        rowKey="name"
        loading={isLoading}
        pagination={false}
        size="small"
      />

      <Modal
        title={`测试工具: ${selectedTool?.name || ''}`}
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={null}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {selectedTool && (
            <div>
              <strong>描述:</strong> {selectedTool.description}
            </div>
          )}

          <Form layout="vertical">
            <Form.Item label="输入参数 (JSON格式)">
              <Input.TextArea
                rows={4}
                placeholder='{"param": "value"}'
                id="test-params"
              />
            </Form.Item>
            <Button
              type="primary"
              loading={testMutation.isPending}
              onClick={() => {
                const input = document.getElementById('test-params') as HTMLTextAreaElement
                handleTestSubmit(input?.value || '{}')
              }}
            >
              执行测试
            </Button>
          </Form>

          {testResult && (
            <div>
              <strong>结果:</strong>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: 12,
                  borderRadius: 4,
                  overflow: 'auto',
                  maxHeight: 300,
                }}
              >
                {testResult}
              </pre>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  )
}

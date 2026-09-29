import { Card, Form, Input, Button, Space, Typography, Result, Spin, Collapse } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTestMcpTool } from '../hooks/useMcpServers'

const { Text, Paragraph } = Typography

interface McpToolTestProps {
  serverId: string
  toolName: string
  toolDescription?: string
  inputSchema?: Record<string, unknown>
}

export default function McpToolTest({ serverId, toolName, toolDescription, inputSchema }: McpToolTestProps) {
  const [form] = Form.useForm()
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const testMutation = useTestMcpTool()

  const handleTest = async (values: { params: string }) => {
    setResult('')
    setError('')
    try {
      const parsedParams = JSON.parse(values.params || '{}')
      const response = await testMutation.mutateAsync({
        serverId,
        toolName,
        params: parsedParams,
      })
      setResult(JSON.stringify(response, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : '测试执行失败')
    }
  }

  const handleReset = () => {
    form.resetFields()
    setResult('')
    setError('')
  }

  return (
    <Card size="small" title="工具测试">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {toolDescription && (
          <div>
            <Text type="secondary">工具描述：</Text>
            <Paragraph>{toolDescription}</Paragraph>
          </div>
        )}

        {inputSchema && Object.keys(inputSchema).length > 0 && (
          <Collapse
            size="small"
            items={[
              {
                key: 'schema',
                label: '输入参数 Schema',
                children: (
                  <pre style={{ fontSize: 12, background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                    {JSON.stringify(inputSchema, null, 2)}
                  </pre>
                ),
              },
            ]}
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleTest}>
          <Form.Item
            name="params"
            label="输入参数 (JSON格式)"
            extra={'请输入有效的JSON对象，如: {"key": "value"}'}
          >
            <Input.TextArea rows={4} placeholder='{"param": "value"}' />
          </Form.Item>

          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              htmlType="submit"
              loading={testMutation.isPending}
            >
              执行测试
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form>

        {testMutation.isPending && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin tip="正在执行测试..." />
          </div>
        )}

        {error && (
          <Result status="error" title="测试失败" subTitle={error} />
        )}

        {result && (
          <div>
            <Text strong>执行结果：</Text>
            <pre
              style={{
                background: result ? '#f5f5f5' : undefined,
                padding: 12,
                borderRadius: 4,
                overflow: 'auto',
                maxHeight: 300,
                marginTop: 8,
              }}
            >
              {result}
            </pre>
          </div>
        )}
      </Space>
    </Card>
  )
}

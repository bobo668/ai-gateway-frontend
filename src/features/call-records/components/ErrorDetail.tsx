import { Card, Typography, Space, Tag, Collapse } from 'antd'

const { Text, Paragraph } = Typography

interface ErrorDetailProps {
  errorCode?: string
  errorMessage?: string
  stack?: string
  fullDetail?: {
    message: string
    stack?: string
    context?: Record<string, unknown>
  }
}

export default function ErrorDetail({ errorCode, errorMessage, stack, fullDetail }: ErrorDetailProps) {
  const hasFullDetail = !!fullDetail

  const renderContent = () => {
    if (hasFullDetail && fullDetail) {
      return (
        <Collapse
          items={[
            {
              key: 'error',
              label: '错误详情（已脱敏）',
              children: (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                      错误消息：
                    </Text>
                    <Paragraph>
                      <Text code>{fullDetail.message}</Text>
                    </Paragraph>
                  </div>

                  {fullDetail.context && Object.keys(fullDetail.context).length > 0 && (
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                        上下文信息：
                      </Text>
                      <pre
                        style={{
                          background: '#f5f5f5',
                          padding: 12,
                          borderRadius: 4,
                          overflow: 'auto',
                          fontSize: 12,
                        }}
                      >
                        {JSON.stringify(fullDetail.context, null, 2)}
                      </pre>
                    </div>
                  )}

                  {fullDetail.stack && (
                    <div>
                      <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                        堆栈跟踪：
                      </Text>
                      <pre
                        style={{
                          background: '#fff2f0',
                          padding: 12,
                          borderRadius: 4,
                          overflow: 'auto',
                          fontSize: 11,
                          maxHeight: 200,
                        }}
                      >
                        {fullDetail.stack}
                      </pre>
                    </div>
                  )}
                </Space>
              ),
            },
          ]}
        />
      )
    }

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {errorCode && (
          <div>
            <Text type="secondary">错误代码：</Text>
            <Tag color="error" style={{ marginLeft: 8 }}>
              {errorCode}
            </Tag>
          </div>
        )}
        {errorMessage && (
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
              错误消息：
            </Text>
            <Paragraph>
              <Text type="danger">{errorMessage}</Text>
            </Paragraph>
          </div>
        )}
        {stack && (
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
              堆栈跟踪：
            </Text>
            <pre
              style={{
                background: '#fff2f0',
                padding: 12,
                borderRadius: 4,
                overflow: 'auto',
                fontSize: 11,
                maxHeight: 200,
              }}
            >
              {stack}
            </pre>
          </div>
        )}
      </Space>
    )
  }

  return (
    <Card size="small" title="错误详情">
      {renderContent()}
    </Card>
  )
}

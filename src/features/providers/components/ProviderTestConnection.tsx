import { Button, message, Modal, Spin, Result } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useTestConnection } from '../hooks/useProviders'

interface ProviderTestConnectionProps {
  providerId: string
}

export default function ProviderTestConnection({ providerId }: ProviderTestConnectionProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const testMutation = useTestConnection()

  const handleTest = async () => {
    setModalVisible(true)
    setTestResult(null)
    try {
      const result = await testMutation.mutateAsync(providerId)
      setTestResult({
        success: result.success ?? false,
        message: result.message || (result.success ? '连接成功' : '连接失败'),
      })
    } catch (error: unknown) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : '测试连接失败',
      })
    }
  }

  const handleClose = () => {
    setModalVisible(false)
    setTestResult(null)
  }

  return (
    <>
      <Button icon={<ApiOutlined />} onClick={handleTest}>
        测试连接
      </Button>
      <Modal
        title="测试服务商连接"
        open={modalVisible}
        onCancel={handleClose}
        footer={
          testResult ? (
            <Button type="primary" onClick={handleClose}>
              关闭
            </Button>
          ) : null
        }
      >
        {testMutation.isPending ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin tip="正在测试连接..." />
          </div>
        ) : testResult ? (
          <Result
            status={testResult.success ? 'success' : 'error'}
            title={testResult.success ? '连接成功' : '连接失败'}
            subTitle={testResult.message}
          />
        ) : null}
      </Modal>
    </>
  )
}

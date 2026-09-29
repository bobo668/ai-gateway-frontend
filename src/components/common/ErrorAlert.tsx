import { Alert } from 'antd'

interface ErrorAlertProps {
  message?: string
  description?: string
  onClose?: () => void
}

export default function ErrorAlert({ message = '错误', description, onClose }: ErrorAlertProps) {
  return (
    <Alert
      message={message}
      description={description}
      type="error"
      showIcon
      closable={!!onClose}
      onClose={onClose}
      style={{ marginBottom: 16 }}
    />
  )
}

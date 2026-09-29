import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ConfirmDialogProps {
  open: boolean
  title: string
  content: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消',
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: danger ? '#ff4d4f' : '#faad14', marginRight: 8 }} />
          {title}
        </span>
      }
      okText={confirmText}
      cancelText={cancelText}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{ danger }}
    >
      <p>{content}</p>
    </Modal>
  )
}

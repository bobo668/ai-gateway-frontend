import { Spin } from 'antd'

interface LoadingSpinnerProps {
  tip?: string
  size?: 'small' | 'default' | 'large'
  fullScreen?: boolean
}

export default function LoadingSpinner({ tip = '加载中...', size = 'default', fullScreen = false }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      >
        <Spin size={size} tip={tip} />
      </div>
    )
  }

  return <Spin size={size} tip={tip} />
}

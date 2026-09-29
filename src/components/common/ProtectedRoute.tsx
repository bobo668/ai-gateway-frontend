import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: 临时跳过登录验证，正式环境需要恢复
  // const { isAuthenticated } = useAuthStore()
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />
  // }

  return <>{children}</>
}

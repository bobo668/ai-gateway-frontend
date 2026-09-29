import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateToken: (token: string) => void
}

// 测试用 Token - 临时绕过登录
const TEST_TOKEN = 'test-api-key-for-development'
const TEST_USER: User = { id: '1', username: 'admin', role: 'ADMIN' }

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: TEST_TOKEN, // 临时使用测试 Token
      user: TEST_USER,
      isAuthenticated: true, // 临时跳过登录验证

      login: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true })
      },

      logout: () => {
        // 临时禁止登出
        // set({ token: null, user: null, isAuthenticated: false })
      },

      updateToken: (token: string) => {
        set({ token })
      },
    }),
    {
      name: 'ai-gateway-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

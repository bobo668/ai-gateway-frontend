import { create } from 'zustand'

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

// 测试用 Token - 临时绕过登录（不使用 persist）
const TEST_TOKEN = 'test-api-key-for-development'
const TEST_USER: User = { id: '1', username: 'admin', role: 'ADMIN' }

export const useAuthStore = create<AuthState>()((set) => ({
  token: TEST_TOKEN,
  user: TEST_USER,
  isAuthenticated: true,

  login: (token: string, user: User) => {
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    // 临时禁止登出
  },

  updateToken: (token: string) => {
    set({ token })
  },
}))

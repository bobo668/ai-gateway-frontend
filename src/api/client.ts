import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加认证Token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 响应拦截器：统一错误处理
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data as { message?: string; code?: string }

      switch (status) {
        case 401:
          // Token过期或无效
          useAuthStore.getState().logout()
          window.location.href = '/login'
          break
        case 403:
          console.error('权限不足:', data.message || 'Forbidden')
          break
        case 429:
          console.error('请求过于频繁:', data.message || 'Too Many Requests')
          break
        case 500:
          console.error('服务器错误:', data.message || 'Internal Server Error')
          break
        default:
          console.error('API错误:', data.message || `HTTP ${status}`)
      }
    } else if (error.request) {
      console.error('网络错误: 请检查网络连接')
    } else {
      console.error('请求错误:', error.message)
    }
    return Promise.reject(error)
  },
)

export default client

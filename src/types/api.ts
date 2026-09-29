export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  code?: string
}

export interface PageResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ErrorResponse {
  success: false
  code: string
  message: string
  details?: Record<string, string[]>
}

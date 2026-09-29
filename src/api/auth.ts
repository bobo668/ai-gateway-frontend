import client from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  user: {
    id: string
    username: string
    role: string
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await client.post('/auth/logout')
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await client.post<LoginResponse>('/auth/refresh')
    return response.data
  },
}

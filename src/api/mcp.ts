import client from './client'
import type { McpServer, McpServerFormData, McpTool } from '@/types/model'

export const mcpApi = {
  getMcpServers: async (): Promise<McpServer[]> => {
    const response = await client.get<McpServer[]>('/mcp/servers')
    return response.data
  },

  getMcpServer: async (id: string): Promise<McpServer> => {
    const response = await client.get<McpServer>(`/mcp/servers/${id}`)
    return response.data
  },

  createMcpServer: async (data: McpServerFormData): Promise<McpServer> => {
    const response = await client.post<McpServer>('/mcp/servers', data)
    return response.data
  },

  updateMcpServer: async (id: string, data: McpServerFormData): Promise<McpServer> => {
    const response = await client.put<McpServer>(`/mcp/servers/${id}`, data)
    return response.data
  },

  deleteMcpServer: async (id: string): Promise<void> => {
    await client.delete(`/mcp/servers/${id}`)
  },

  getMcpTools: async (serverId: string): Promise<McpTool[]> => {
    const response = await client.get<McpTool[]>(`/mcp/servers/${serverId}/tools`)
    return response.data
  },

  testMcpTool: async (serverId: string, toolName: string, params: Record<string, unknown>): Promise<unknown> => {
    const response = await client.post<unknown>(`/mcp/servers/${serverId}/tools/${toolName}/test`, params)
    return response.data
  },
}

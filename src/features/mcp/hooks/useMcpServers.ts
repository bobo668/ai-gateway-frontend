import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mcpApi } from '@/api/mcp'
import type { McpServer, McpServerFormData, McpTool } from '@/types/model'

export function useMcpServers() {
  return useQuery({
    queryKey: ['mcp-servers'],
    queryFn: () => mcpApi.getMcpServers(),
  })
}

export function useMcpServer(id: string) {
  return useQuery({
    queryKey: ['mcp-servers', id],
    queryFn: () => mcpApi.getMcpServer(id),
    enabled: !!id,
  })
}

export function useCreateMcpServer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: McpServerFormData) => mcpApi.createMcpServer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
    },
  })
}

export function useUpdateMcpServer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: McpServerFormData }) =>
      mcpApi.updateMcpServer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
      queryClient.invalidateQueries({ queryKey: ['mcp-servers', id] })
    },
  })
}

export function useDeleteMcpServer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mcpApi.deleteMcpServer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
    },
  })
}

export function useMcpTools(serverId: string) {
  return useQuery({
    queryKey: ['mcp-servers', serverId, 'tools'],
    queryFn: () => mcpApi.getMcpTools(serverId),
    enabled: !!serverId,
  })
}

export function useTestMcpTool() {
  return useMutation({
    mutationFn: ({ serverId, toolName, params }: { serverId: string; toolName: string; params: Record<string, unknown> }) =>
      mcpApi.testMcpTool(serverId, toolName, params),
  })
}

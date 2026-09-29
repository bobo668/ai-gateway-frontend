import { useParams, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import DetailPanel from '@/components/DetailPanel'
import ProviderStatus from '../components/ProviderStatus'
import ProviderFailoverConfig from '../components/ProviderFailoverConfig'
import ProviderTestConnection from '../components/ProviderTestConnection'
import { useProvider } from '../hooks/useProviders'

const providerTypeMap: Record<string, string> = {
  OPENAI: 'OpenAI',
  CLAUDE: 'Claude',
  GEMINI: 'Gemini',
  OTHER: '其他',
}

const capabilityMap: Record<string, string> = {
  TEXT: '文本生成',
  IMAGE: '图像生成',
  EMBEDDING: '向量嵌入',
}

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: provider, isLoading } = useProvider(id!)

  if (!provider) {
    return null
  }

  const sections = [
    {
      title: '基本信息',
      fields: [
        { label: '服务商名称', value: provider.name },
        {
          label: '服务商类型',
          value: providerTypeMap[provider.providerType] || provider.providerType,
        },
        { label: 'API 端点', value: provider.endpoint },
        { label: 'API 版本', value: provider.apiVersion || '-' },
        {
          label: '支持的能力',
          value: (
            <>
              {provider.capabilities?.map((cap) => (
                <span key={cap} style={{ marginRight: 8 }}>
                  {capabilityMap[cap] || cap}
                </span>
              )) || '-'}
            </>
          ),
        },
      ],
    },
    {
      title: '状态信息',
      fields: [
        {
          label: '健康状态',
          value: <ProviderStatus status={provider.status} />,
        },
        {
          label: '最后健康检查',
          value: provider.lastHealthCheck
            ? new Date(provider.lastHealthCheck).toLocaleString('zh-CN')
            : '-',
        },
        {
          label: '优先级',
          value: provider.priority,
        },
        {
          label: '故障转移',
          value: provider.failoverEnabled ? '已启用' : '未启用',
        },
        {
          label: '启用状态',
          value: provider.isEnabled ? '已启用' : '已禁用',
        },
      ],
    },
  ]

  return (
    <div>
      <DetailPanel
        title="服务商详情"
        sections={sections}
        loading={isLoading}
        onBack={() => navigate('/providers')}
        status={
          provider.status
            ? {
                text: provider.status === 'HEALTHY' ? '健康' : provider.status === 'UNHEALTHY' ? '异常' : '未知',
                color: provider.status === 'HEALTHY' ? 'success' : provider.status === 'UNHEALTHY' ? 'error' : 'default',
              }
            : undefined
        }
        extra={<ProviderTestConnection providerId={id!} />}
      />

      {provider.failoverEnabled && (
        <div style={{ marginTop: 16 }}>
          <ProviderFailoverConfig providerId={id!} />
        </div>
      )}
    </div>
  )
}

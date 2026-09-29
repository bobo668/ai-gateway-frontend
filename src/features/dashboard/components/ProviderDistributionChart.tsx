import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

interface ProviderDistributionChartProps {
  data: { name: string; value: number; cost: number }[]
  loading?: boolean
}

export default function ProviderDistributionChart({ data, loading }: ProviderDistributionChartProps) {
  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number; cost: number }) => {
        return `${params.name}<br/>请求量: ${params.value}<br/>费用: ¥${params.cost.toFixed(2)}`
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '服务商分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: data.map((d, i) => ({
          value: d.value,
          name: d.name,
          itemStyle: {
            color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'][i % 5],
          },
        })),
      },
    ],
  }), [data])

  return <ReactECharts option={option} style={{ height: 300 }} showLoading={loading} />
}

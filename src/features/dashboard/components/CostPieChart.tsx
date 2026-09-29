import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

interface CostPieChartProps {
  data: { name: string; value: number }[]
  loading?: boolean
}

export default function CostPieChart({ data, loading }: CostPieChartProps) {
  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number }) => {
        return `${params.name}<br/>费用: ¥${params.value.toFixed(2)}`
      },
    },
    legend: {
      orient: 'vertical',
      right: 'right',
    },
    series: [
      {
        name: '费用占比',
        type: 'pie',
        radius: '60%',
        center: ['40%', '50%'],
        data: data.map((d, i) => ({
          value: d.value,
          name: d.name,
          itemStyle: {
            color: ['#ff6b6b', '#ffa502', '#26de81', '#2bcbba', '#eb3b5a'][i % 5],
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }), [data])

  return <ReactECharts option={option} style={{ height: 300 }} showLoading={loading} />
}

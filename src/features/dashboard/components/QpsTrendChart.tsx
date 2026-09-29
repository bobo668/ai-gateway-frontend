import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

interface QpsTrendChartProps {
  data: { timestamp: number; qps: number }[]
  loading?: boolean
}

export default function QpsTrendChart({ data, loading }: QpsTrendChartProps) {
  const option = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: { value: [number, number] }[]) => {
        const point = params[0]
        const date = new Date(point.value[0])
        return `${date.toLocaleString()}<br/>QPS: ${point.value[1].toFixed(2)}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: 'QPS',
      min: 0,
    },
    series: [
      {
        name: 'QPS',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.4)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ],
          },
        },
        lineStyle: {
          color: '#1890ff',
          width: 2,
        },
        data: data.map((d) => [d.timestamp, d.qps]),
      },
    ],
  }), [data])

  return <ReactECharts option={option} style={{ height: 300 }} showLoading={loading} />
}

/** 图表通用逻辑（规范 7.4：ECharts 生命周期管理） */
import { onMounted, onBeforeUnmount, shallowRef, type ShallowRef } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsCoreOption } from 'echarts/core'

/* 按需注册（控制打包体积，规范 9.3 性能门禁） */
echarts.use([
  BarChart, LineChart, PieChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  CanvasRenderer
])

export { echarts }

/** 设计规范图表色板（2.2-4） */
export const CHART_COLORS = ['#2563EB', '#EF4444', '#10B981', '#8B5CF6', '#6B7280', '#F59E0B', '#3B82F6']

export interface UseChartReturn {
  chartRef: ShallowRef<HTMLElement | null>
  setOption: (option: EChartsCoreOption) => void
}

/**
 * ECharts 生命周期管理：初始化、更新、自适应、销毁
 * @example
 * const { chartRef, setOption } = useChart()
 * watchEffect(() => setOption(buildOption(data.value)))
 */
export function useChart(): UseChartReturn {
  const chartRef = shallowRef<HTMLElement | null>(null)
  let chart: echarts.ECharts | null = null
  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (chartRef.value) {
      chart = echarts.init(chartRef.value)
      observer = new ResizeObserver(() => chart?.resize())
      observer.observe(chartRef.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    chart?.dispose()
    chart = null
  })

  function setOption(option: EChartsCoreOption): void {
    chart?.setOption({ color: CHART_COLORS, ...option }, true)
  }

  return { chartRef, setOption }
}

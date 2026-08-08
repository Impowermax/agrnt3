<script setup lang="ts">
/**
 * 柱状图封装（规范 4.3 ChartBar：支持横向 / 纵向、多系列）
 */
import { watch, onMounted } from 'vue'
import { useChart } from '@/composables/useChart'
import type { ChartData } from '@/types/common'

interface BarSeries {
  name: string
  data: number[]
}

interface Props {
  /** 类目轴 */
  categories: string[]
  /** 多系列数据；单系列可用 data 简写 */
  series?: BarSeries[]
  /** 单系列简写 */
  data?: ChartData[]
  /** 横向条形图 */
  horizontal?: boolean
  /** 高度 */
  height?: string
  /** 数值单位 */
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  series: undefined, data: undefined, horizontal: false, height: '300px', unit: ''
})

const { chartRef, setOption } = useChart()

function render(): void {
  const seriesList: BarSeries[] = props.series ?? [{ name: '数量', data: (props.data ?? []).map((d) => d.value) }]
  const axisLabel = { fontSize: 11, color: '#9CA3AF', interval: 0 as const }
  const categoryAxis = {
    type: 'category' as const,
    data: props.categories.length ? props.categories : (props.data ?? []).map((d) => d.name),
    axisLabel: props.horizontal ? { ...axisLabel, width: 110, overflow: 'truncate' as const } : axisLabel,
    axisLine: { lineStyle: { color: '#E5E7EB' } }
  }
  const valueAxis = {
    type: 'value' as const,
    splitLine: { lineStyle: { color: '#F3F4F6' } },
    axisLabel: { fontSize: 11, color: '#9CA3AF' }
  }

  setOption({
    tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}${props.unit}` },
    legend: seriesList.length > 1 ? { bottom: 0, textStyle: { fontSize: 12, color: '#4B5563' } } : undefined,
    grid: { left: 8, right: 16, top: 24, bottom: seriesList.length > 1 ? 32 : 8, containLabel: true },
    xAxis: props.horizontal ? valueAxis : categoryAxis,
    yAxis: props.horizontal ? categoryAxis : valueAxis,
    series: seriesList.map((s) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      barMaxWidth: 28,
      itemStyle: { borderRadius: props.horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0] },
      label: { show: true, position: props.horizontal ? 'right' : 'top', fontSize: 11, color: '#4B5563' }
    }))
  })
}

onMounted(render)
watch(() => [props.data, props.series, props.categories], render, { deep: true })
</script>

<template>
  <div ref="chartRef" class="chart-bar" :style="{ height }" />
</template>

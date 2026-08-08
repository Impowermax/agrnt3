<script setup lang="ts">
/**
 * 折线图封装（规范 4.3 ChartLine：支持多系列）
 */
import { watch, onMounted } from 'vue'
import { useChart, CHART_COLORS } from '@/composables/useChart'
import type { ChartData } from '@/types/common'

interface Props {
  /** 图表数据（单系列） */
  data: ChartData[]
  /** 高度 */
  height?: string
  /** 是否显示面积 */
  area?: boolean
}

const props = withDefaults(defineProps<Props>(), { height: '300px', area: true })

const { chartRef, setOption } = useChart()

function render(): void {
  setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 8, right: 16, top: 24, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.data.map((d) => d.name),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#E5E7EB' } },
      axisLabel: { fontSize: 11, color: '#9CA3AF' }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: '#F3F4F6' } },
      axisLabel: { fontSize: 11, color: '#9CA3AF' }
    },
    series: [
      {
        type: 'line',
        data: props.data.map((d) => d.value),
        smooth: true,
        symbolSize: 7,
        lineStyle: { width: 2.5, color: CHART_COLORS[0] },
        itemStyle: { color: CHART_COLORS[0] },
        areaStyle: props.area
          ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.18)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.01)' }
            ] } }
          : undefined,
        label: { show: true, fontSize: 11, color: '#1F2937' }
      }
    ]
  })
}

onMounted(render)
watch(() => props.data, render, { deep: true })
</script>

<template>
  <div ref="chartRef" class="chart-line" :style="{ height }" />
</template>

<script setup lang="ts">
/**
 * 饼图 / 环形图封装（规范 4.3 ChartPie：自动计算百分比和图例）
 */
import { watch, onMounted } from 'vue'
import { useChart } from '@/composables/useChart'
import type { ChartData } from '@/types/common'

interface Props {
  /** 图表数据 */
  data: ChartData[]
  /** 标题（显示在中心） */
  centerLabel?: string
  /** 高度 */
  height?: string
}

const props = withDefaults(defineProps<Props>(), { centerLabel: '总计', height: '280px' })

const { chartRef, setOption } = useChart()

function render(): void {
  const total = props.data.reduce((s, d) => s + d.value, 0)
  setOption({
    tooltip: { trigger: 'item', formatter: '{b}：{c}（{d}%）' },
    legend: { bottom: 0, textStyle: { fontSize: 12, color: '#4B5563' } },
    series: [
      {
        type: 'pie',
        radius: ['52%', '72%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 600, formatter: '{b}\n{d}%' } },
        data: props.data
      },
      {
        type: 'pie',
        radius: ['0%', '0%'],
        center: ['50%', '44%'],
        label: {
          show: true,
          position: 'center',
          formatter: `{a|${total}}\n{b|${props.centerLabel}}`,
          rich: {
            a: { fontSize: 26, fontWeight: 600, color: '#1F2937', lineHeight: 34 },
            b: { fontSize: 12, color: '#9CA3AF' }
          }
        },
        data: []
      }
    ]
  })
}

onMounted(render)
watch(() => props.data, render, { deep: true })
</script>

<template>
  <div ref="chartRef" class="chart-pie" :style="{ height }" />
</template>

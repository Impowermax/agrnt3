/** BI 看板状态（规范 3.4：useBIStore） */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getBIStats, getStatusDistribution, getAmountStats,
  getIssueByStage, getIssueByStep, getIssueTrend
} from '@/api/bi'
import type { BIStats } from '@/types/system'
import type { ChartData } from '@/types/common'

export const useBIStore = defineStore('bi', () => {
  const stats = ref<BIStats | null>(null)
  const statusDist = ref<ChartData[]>([])
  const amountStats = ref<{ cats: string[]; plan: number[]; budget: number[]; actual: number[] } | null>(null)
  const issueByStage = ref<ChartData[]>([])
  const issueByStep = ref<ChartData[]>([])
  const issueTrend = ref<ChartData[]>([])
  const loading = ref(false)

  /** 一次性加载看板全部数据 */
  async function fetchAll(): Promise<void> {
    loading.value = true
    try {
      const [s, sd, am, bs, bp, tr] = await Promise.all([
        getBIStats(), getStatusDistribution(), getAmountStats(),
        getIssueByStage(), getIssueByStep(), getIssueTrend()
      ])
      stats.value = s
      statusDist.value = sd
      amountStats.value = am
      issueByStage.value = bs
      issueByStep.value = bp
      issueTrend.value = tr
    } finally {
      loading.value = false
    }
  }

  return { stats, statusDist, amountStats, issueByStage, issueByStep, issueTrend, loading, fetchAll }
})

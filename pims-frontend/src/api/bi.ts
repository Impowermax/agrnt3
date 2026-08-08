/** BI 看板接口（规范：api/bi.ts） */
import { mockDelay, PROJECTS, PROBLEMS } from './mock/data'
import type { BIStats } from '@/types/system'
import type { ChartData } from '@/types/common'
import type { ProjectStatus } from '@/types/project'

const STATUS_LIST: ProjectStatus[] = ['新增项目', '拟建项目', '在建项目', '建设完毕']

/** 看板核心统计 */
export function getBIStats(): Promise<BIStats> {
  const building = PROJECTS.filter((p) => p.status === '在建项目')
  return mockDelay({
    projectTotal: PROJECTS.length,
    amountTotal: PROJECTS.reduce((s, p) => s + p.amount, 0),
    buildingCount: building.length,
    buildingAmount: building.reduce((s, p) => s + p.amount, 0),
    issueTotal: PROBLEMS.length
  })
}

/** 项目状态分布 */
export function getStatusDistribution(): Promise<ChartData[]> {
  return mockDelay(STATUS_LIST.map((s) => ({ name: s, value: PROJECTS.filter((p) => p.status === s).length })))
}

/** 投资金额统计（计划/概算/实际 × 状态） */
export function getAmountStats(): Promise<{ cats: string[]; plan: number[]; budget: number[]; actual: number[] }> {
  const sum = (s: ProjectStatus) => PROJECTS.filter((p) => p.status === s).reduce((v, p) => v + p.amount, 0)
  return mockDelay({
    cats: [...STATUS_LIST],
    plan: STATUS_LIST.map(sum),
    budget: STATUS_LIST.map((s) => Math.round(sum(s) * 0.97)),
    actual: STATUS_LIST.map((s) => Math.round(sum(s) * (s === '建设完毕' ? 0.94 : 0.31)))
  })
}

/** 问题按阶段分布 */
export function getIssueByStage(): Promise<ChartData[]> {
  const map = new Map<string, number>()
  PROBLEMS.forEach((p) => map.set(p.stage, (map.get(p.stage) || 0) + 1))
  return mockDelay([...map.entries()].map(([name, value]) => ({ name, value })))
}

/** 问题按关键环节分布 */
export function getIssueByStep(): Promise<ChartData[]> {
  const map = new Map<string, number>()
  PROBLEMS.forEach((p) => map.set(p.step, (map.get(p.step) || 0) + 1))
  return mockDelay([...map.entries()].map(([name, value]) => ({ name, value })))
}

/** 问题录入趋势（2026 年） */
export function getIssueTrend(): Promise<ChartData[]> {
  return mockDelay([
    { name: '1月', value: 1 }, { name: '2月', value: 0 }, { name: '3月', value: 1 },
    { name: '4月', value: 2 }, { name: '5月', value: 1 }, { name: '6月', value: 2 }, { name: '7月', value: 2 }
  ])
}

/** 经验库接口（规范：api/exp.ts） */
import { mockDelay, EXPERIENCES } from './mock/data'
import type { Experience, ExpQuery } from '@/types/exp'

/** 获取经验列表（已审核公开） */
export function getExpList(query: ExpQuery): Promise<Experience[]> {
  const list = EXPERIENCES.filter(
    (e) =>
      (!query.keyword || e.title.includes(query.keyword) || e.desc.includes(query.keyword)) &&
      (!query.stageId || e.stageId === query.stageId) &&
      (!query.step || e.step === query.step)
  )
  return mockDelay(list)
}

/** 提交经验（进入待审核） */
export function createExp(payload: { project: string; step: string; title: string; desc: string }): Promise<boolean> {
  return mockDelay(true)
}

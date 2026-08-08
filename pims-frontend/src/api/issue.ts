/** 问题库接口（规范：api/issue.ts） */
import { mockDelay, PROBLEMS, PENDING_REVIEWS } from './mock/data'
import type { Issue, IssueQuery } from '@/types/issue'
import type { PendingReview } from '@/types/system'

/** 获取问题列表（已审核公开） */
export function getIssueList(query: IssueQuery): Promise<Issue[]> {
  const list = PROBLEMS.filter(
    (p) =>
      (!query.keyword || p.desc.includes(query.keyword)) &&
      (!query.stageId || p.stageId === query.stageId) &&
      (!query.step || p.step === query.step)
  )
  return mockDelay(list)
}

/** 提交问题（进入待审核） */
export function createIssue(payload: { project: string; step: string; desc: string }): Promise<boolean> {
  return mockDelay(true)
}

/** 待审核列表 */
export function getPendingReviews(): Promise<PendingReview[]> {
  return mockDelay(PENDING_REVIEWS)
}

/** 审核操作 */
export function reviewContent(id: number, pass: boolean): Promise<boolean> {
  return mockDelay(true)
}

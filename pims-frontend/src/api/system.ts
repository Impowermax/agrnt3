/** 系统管理接口（规范：api/system.ts） */
import { mockDelay, SYSTEM_USERS, DEMO_ACCOUNTS, PENDING_REVIEWS } from './mock/data'
import type { SystemUser, PendingReview } from '@/types/system'
import type { LoginUser } from '@/types/common'

/** 登录 */
export function login(account: string, password: string): Promise<{ token: string; user: LoginUser } | null> {
  const found = DEMO_ACCOUNTS.find((a) => a.account === account && a.password === password)
  if (!found) return mockDelay(null)
  const { password: _pwd, ...user } = found
  return mockDelay({ token: `mock-token-${found.id}-${Date.now()}`, user })
}

/** 用户列表 */
export function getUserList(): Promise<SystemUser[]> {
  return mockDelay(SYSTEM_USERS)
}

/** 待审核内容列表 */
export function getPendingReviews(status?: '待审核' | '已通过' | '已驳回'): Promise<PendingReview[]> {
  // 演示：默认返回待审核内容；已通过/已驳回返回空（实际由后端按状态过滤）
  return mockDelay(status && status !== '待审核' ? [] : PENDING_REVIEWS)
}

/** 审核内容：通过 / 驳回 */
export function reviewContent(id: number, action: 'pass' | 'reject'): Promise<boolean> {
  return mockDelay(true)
}

/** 导出项目全周期内容（Excel） */
export function exportProjectContent(projectId: number, fields: string[], stageId?: number): Promise<boolean> {
  return mockDelay(true)
}

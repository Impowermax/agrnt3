/** 系统管理类型（规范：types/system.ts） */
import type { UserRole } from './common'

/** 系统用户 */
export interface SystemUser {
  id: number
  name: string
  account: string
  role: UserRole
  org: string
  status: '启用' | '停用'
}

/** 待审核内容 */
export interface PendingReview {
  id: number
  type: '问题' | '经验'
  title: string
  project: string
  step: string
  submitter: string
  date: string
}

/** 制度文件 */
export interface PolicyFile {
  id: number
  name: string
  cat: string
  size: string
  date: string
  uploader: string
}

/** BI 看板统计数据 */
export interface BIStats {
  projectTotal: number
  amountTotal: number
  buildingCount: number
  buildingAmount: number
  issueTotal: number
}

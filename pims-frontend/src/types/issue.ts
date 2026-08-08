/** 问题库类型（规范：types/issue.ts） */

/** 问题记录（已审核公开） */
export interface Issue {
  id: number
  /** 所属阶段序号 */
  stageId: number
  /** 所属阶段名称 */
  stage: string
  /** 关键环节 / 实施步骤 */
  step: string
  /** 关联项目 */
  project: string
  /** 录入时间 */
  date: string
  /** 问题描述 */
  desc: string
}

/** 问题检索条件 */
export interface IssueQuery {
  keyword: string
  stageId: number | ''
  step: string
}

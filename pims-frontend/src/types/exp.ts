/** 经验库类型（规范：types/exp.ts） */

/** 经验记录（已审核公开） */
export interface Experience {
  id: number
  /** 经验标题 */
  title: string
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
  /** 经验描述 */
  desc: string
}

/** 经验检索条件 */
export interface ExpQuery {
  keyword: string
  stageId: number | ''
  step: string
}

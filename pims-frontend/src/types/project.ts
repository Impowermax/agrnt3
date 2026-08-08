/** 项目相关类型（规范：types/project.ts） */

/** 项目类型 */
export type ProjectType = '固定资产投资项目' | '信息化投资项目'

/** 项目状态 */
export type ProjectStatus = '新增项目' | '拟建项目' | '在建项目' | '建设完毕'

/** 关键环节 / 实施步骤 */
export interface StepInfo {
  /** 环节名称 */
  name: string
  /** 工作要求 */
  req: string
  /** 法律政策制度依据 */
  law: string
  /** 注意事项 */
  notice: string
  /** 潜在风险 */
  risk: string
}

/** 项目阶段 */
export interface Stage {
  /** 阶段序号（1-12） */
  id: number
  /** 阶段名称 */
  name: string
  /** 该阶段下的关键环节 */
  steps: StepInfo[]
  /** 阶段完成天数（用于阶段计划周期管理） */
  duration?: number
}

/** 项目信息 */
export interface Project {
  id: number
  /** 项目名称 */
  name: string
  /** 项目类型 */
  type: ProjectType
  /** 当前阶段名称 */
  stage: string
  /** 当前阶段序号 */
  stageId: number
  /** 项目状态 */
  status: ProjectStatus
  /** 投资金额（万元） */
  amount: number
  /** 立项时间 */
  date: string
  /** 项目负责人 */
  manager: string
  /** 实施单位 */
  org?: string
  /** 当前阶段计划结束日期（yyyy-MM-dd），用于阶段结束前预警 */
  stageEndDate?: string
}

/** 新增项目表单 */
export interface ProjectCreateForm {
  name: string
  type: ProjectType
  org: string
  amount: number | null
  date: string
  manager: string
  phone: string
  description: string
}

/** 实施情况记录 */
export interface ImplRecord {
  id: number
  user: string
  date: string
  text: string
  images: number
  files: number
}

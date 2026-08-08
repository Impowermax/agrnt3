/** 通用类型（规范：types/common.ts） */

/** 统一响应体 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页请求参数 */
export interface PageQuery {
  pageNum: number
  pageSize: number
}

/** 分页响应 */
export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

/** 图表数据项 */
export interface ChartData {
  name: string
  value: number
}

/** 搜索筛选项配置（SearchFilter 组件） */
export interface FilterConfig {
  /** 字段 key */
  key: string
  /** 标签 */
  label: string
  /** 控件类型 */
  type: 'input' | 'select'
  /** 占位提示 */
  placeholder?: string
  /** select 选项 */
  options?: { label: string; value: string | number }[]
}

/** 用户角色 */
export type UserRole = '系统管理员' | '内容审核员' | '项目实施单位' | '审批单位人员' | '管理层'

/** 登录用户 */
export interface LoginUser {
  id: number
  name: string
  account: string
  role: UserRole
  org: string
}

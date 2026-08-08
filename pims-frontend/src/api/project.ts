/** 项目管理接口（规范：api/project.ts） */
import { mockDelay, PROJECTS } from './mock/data'
import type { Project, ProjectCreateForm, ProjectStatus } from '@/types/project'

export interface ProjectListQuery {
  keyword?: string
  type?: string
  stage?: string
  status?: ProjectStatus | ''
}

/** 获取项目列表 */
export function getProjectList(query: ProjectListQuery = {}): Promise<Project[]> {
  const list = PROJECTS.filter(
    (p) =>
      (!query.status || p.status === query.status) &&
      (!query.keyword || p.name.includes(query.keyword)) &&
      (!query.type || p.type === query.type) &&
      (!query.stage || p.stage === query.stage)
  )
  return mockDelay(list)
  // 联调后：return service.get('/project/list', { params: query })
}

/** 获取项目详情 */
export function getProjectDetail(id: number): Promise<Project | undefined> {
  return mockDelay(PROJECTS.find((p) => p.id === id))
}

/** 新增项目 */
export function createProject(form: ProjectCreateForm): Promise<{ id: number }> {
  return mockDelay({ id: Date.now() })
}

/** 保存实施情况记录 */
export function saveImplRecord(projectId: number, stepName: string, text: string): Promise<boolean> {
  return mockDelay(true)
}

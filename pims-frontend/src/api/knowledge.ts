/** 知识库接口（规范：api/knowledge.ts） */
import { mockDelay, STAGES, POLICY_FILES } from './mock/data'
import type { Stage } from '@/types/project'
import type { PolicyFile } from '@/types/system'

/** 获取全生命周期流程（知识库） */
export function getKnowledgeStages(): Promise<Stage[]> {
  return mockDelay(STAGES)
}

/** 获取制度文件列表 */
export function getPolicyFiles(): Promise<PolicyFile[]> {
  return mockDelay(POLICY_FILES)
}

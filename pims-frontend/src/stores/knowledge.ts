/** 知识库状态（规范 3.4：useKnowledgeStore） */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getKnowledgeStages, getPolicyFiles } from '@/api/knowledge'
import type { Stage } from '@/types/project'
import type { PolicyFile } from '@/types/system'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const stages = ref<Stage[]>([])
  const policyFiles = ref<PolicyFile[]>([])
  const loading = ref(false)
  /** 当前展开的阶段 id */
  const activeStageId = ref<number>(1)
  /** 当前选中的环节索引 */
  const activeStepIndex = ref<number>(0)

  async function fetchStages(): Promise<void> {
    if (stages.value.length) return
    loading.value = true
    try {
      stages.value = await getKnowledgeStages()
    } finally {
      loading.value = false
    }
  }

  async function fetchPolicyFiles(): Promise<void> {
    policyFiles.value = await getPolicyFiles()
  }

  function select(stageId: number, stepIndex: number): void {
    activeStageId.value = stageId
    activeStepIndex.value = stepIndex
  }

  return { stages, policyFiles, loading, activeStageId, activeStepIndex, fetchStages, fetchPolicyFiles, select }
})

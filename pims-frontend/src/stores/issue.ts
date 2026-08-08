/** 问题库状态（规范 3.4：useIssueStore） */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getIssueList } from '@/api/issue'
import type { Issue, IssueQuery } from '@/types/issue'

export const useIssueStore = defineStore('issue', () => {
  const issueList = ref<Issue[]>([])
  const loading = ref(false)
  const query = ref<IssueQuery>({ keyword: '', stageId: '', step: '' })

  async function fetchList(q?: IssueQuery): Promise<void> {
    if (q) query.value = { ...q }
    loading.value = true
    try {
      issueList.value = await getIssueList(query.value)
    } finally {
      loading.value = false
    }
  }

  return { issueList, loading, query, fetchList }
})

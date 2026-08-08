/** 经验库状态（规范 3.4：useExpStore） */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getExpList } from '@/api/exp'
import type { Experience, ExpQuery } from '@/types/exp'

export const useExpStore = defineStore('exp', () => {
  const expList = ref<Experience[]>([])
  const loading = ref(false)
  const query = ref<ExpQuery>({ keyword: '', stageId: '', step: '' })

  async function fetchList(q?: ExpQuery): Promise<void> {
    if (q) query.value = { ...q }
    loading.value = true
    try {
      expList.value = await getExpList(query.value)
    } finally {
      loading.value = false
    }
  }

  return { expList, loading, query, fetchList }
})

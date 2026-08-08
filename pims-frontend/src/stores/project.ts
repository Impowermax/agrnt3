/** 项目状态（规范 3.4：useProjectStore） */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProjectList, getProjectDetail, type ProjectListQuery } from '@/api/project'
import type { Project } from '@/types/project'

export const useProjectStore = defineStore('project', () => {
  const projectList = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const lastQuery = ref<ProjectListQuery>({})

  /** 加载项目列表 */
  async function fetchList(query: ProjectListQuery = {}): Promise<void> {
    loading.value = true
    lastQuery.value = query
    try {
      projectList.value = await getProjectList(query)
    } finally {
      loading.value = false
    }
  }

  /** 加载项目详情 */
  async function fetchDetail(id: number): Promise<void> {
    loading.value = true
    try {
      currentProject.value = (await getProjectDetail(id)) || null
    } finally {
      loading.value = false
    }
  }

  return { projectList, currentProject, loading, lastQuery, fetchList, fetchDetail }
})

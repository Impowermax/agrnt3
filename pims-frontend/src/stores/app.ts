/** 应用全局状态（规范 3.4：useAppStore，localStorage 持久化） */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAppConfig, setAppConfig } from '@/utils/storage'

export const useAppStore = defineStore('app', () => {
  const config = getAppConfig()
  const sidebarCollapsed = ref<boolean>(config.sidebarCollapsed)

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
    setAppConfig({ sidebarCollapsed: sidebarCollapsed.value })
  }

  return { sidebarCollapsed, toggleSidebar }
})

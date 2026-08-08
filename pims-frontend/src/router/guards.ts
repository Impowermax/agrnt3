/** 路由守卫（规范 6.4：全局权限拦截唯一入口） */
import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const userStore = useUserStore()

    /* 公开页面 */
    if (to.meta.public) {
      // 已登录访问登录页则跳工作台
      if (to.name === 'Login' && userStore.isLoggedIn) return { path: '/dashboard' }
      return true
    }

    /* 登录拦截 */
    if (!userStore.isLoggedIn) {
      return { path: '/login', query: to.fullPath !== '/dashboard' ? { redirect: to.fullPath } : {} }
    }

    /* 角色权限校验 */
    if (to.meta.roles && !userStore.hasRole(to.meta.roles)) {
      ElMessage.error('没有权限访问该页面')
      return { path: '/dashboard' }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} - 投资项目管理辅助系统` : '投资项目管理辅助系统'
  })
}

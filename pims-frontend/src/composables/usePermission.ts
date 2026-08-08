/** 权限检查逻辑（规范 7.4：按钮显隐、菜单权限、数据权限） */
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { UserRole } from '@/types/common'

export function usePermission() {
  const userStore = useUserStore()

  const role = computed(() => userStore.role)

  /** 是否拥有指定角色之一 */
  function hasRole(roles: UserRole[]): boolean {
    return userStore.hasRole(roles)
  }

  /** 是否为项目实施单位（可录入实施情况、提交问题/经验） */
  const canEditProject = computed(() => userStore.hasRole(['项目实施单位', '系统管理员']))

  /** 是否可审核内容 */
  const canReview = computed(() => userStore.hasRole(['内容审核员', '系统管理员']))

  /** 是否为系统管理员 */
  const isAdmin = computed(() => userStore.hasRole(['系统管理员']))

  return { role, hasRole, canEditProject, canReview, isAdmin }
}

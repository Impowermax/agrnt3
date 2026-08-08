/** 权限指令（规范：directives/permission.ts）
 *  用法：v-permission="['系统管理员']" —— 无权限时移除元素
 */
import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'
import type { UserRole } from '@/types/common'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<UserRole[]>) {
    const userStore = useUserStore()
    const roles = binding.value
    if (Array.isArray(roles) && roles.length && !userStore.hasRole(roles)) {
      el.parentNode?.removeChild(el)
    }
  }
}

export default permission

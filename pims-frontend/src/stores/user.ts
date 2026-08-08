/** 用户状态（规范 3.4：useUserStore，localStorage 持久化 token） */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin } from '@/api/system'
import { getToken, setToken, getUser, setUser, clearAuth } from '@/utils/storage'
import type { LoginUser, UserRole } from '@/types/common'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken())
  const userInfo = ref<LoginUser | null>(getUser())

  const isLoggedIn = computed(() => !!token.value)
  const role = computed<UserRole | ''>(() => userInfo.value?.role || '')

  /** 登录 */
  async function login(account: string, password: string): Promise<boolean> {
    const res = await apiLogin(account, password)
    if (!res) return false
    token.value = res.token
    userInfo.value = res.user
    setToken(res.token)
    setUser(res.user)
    return true
  }

  /** 退出登录 */
  function logout(): void {
    token.value = ''
    userInfo.value = null
    clearAuth()
  }

  /** 权限检查：当前用户是否属于指定角色之一 */
  function hasRole(roles: UserRole[]): boolean {
    return !!userInfo.value && roles.includes(userInfo.value.role)
  }

  return { token, userInfo, isLoggedIn, role, login, logout, hasRole }
})

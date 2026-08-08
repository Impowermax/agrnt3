/** 本地存储封装（规范：utils/storage.ts） */
import type { LoginUser } from '@/types/common'

const TOKEN_KEY = 'pims_token'
const USER_KEY = 'pims_user'
const APP_KEY = 'pims_app_config'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getUser(): LoginUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LoginUser
  } catch {
    return null
  }
}

export function setUser(user: LoginUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export interface AppConfig {
  sidebarCollapsed: boolean
}

export function getAppConfig(): AppConfig {
  const raw = localStorage.getItem(APP_KEY)
  if (!raw) return { sidebarCollapsed: false }
  try {
    return { sidebarCollapsed: false, ...JSON.parse(raw) }
  } catch {
    return { sidebarCollapsed: false }
  }
}

export function setAppConfig(config: AppConfig): void {
  localStorage.setItem(APP_KEY, JSON.stringify(config))
}

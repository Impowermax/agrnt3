/* ============================================================
   Axios 实例配置（规范 3.6 网络请求规范）
   - baseURL / 超时 30s / 请求 & 响应拦截器
   - 401 跳登录、403 无权限提示、5xx 服务端错误统一处理
   说明：当前 VITE_USE_MOCK=true，各 api 模块返回 mock 数据；
   联调后置 false 并在此实例基础上发起真实请求。
   ============================================================ */
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, clearAuth } from '@/utils/storage'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000
})

/* 请求拦截器：注入 JWT Token + 防缓存时间戳 */
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }
    return config
  },
  (error) => Promise.reject(error)
)

/* 响应拦截器：统一错误处理 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res && typeof res.code !== 'undefined' && res.code !== 0) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res?.data ?? res
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      clearAuth()
      ElMessage.warning('登录已过期，请重新登录')
      window.location.href = '/login'
    } else if (status === 403) {
      ElMessage.error('没有权限执行该操作')
    } else if (status && status >= 500) {
      ElMessage.error('服务端异常，请稍后重试')
    } else {
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

export default service

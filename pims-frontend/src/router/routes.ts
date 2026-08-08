/** 路由定义（规范 3.5：路由懒加载 + meta 权限要求） */
import type { RouteRecordRaw } from 'vue-router'
import type { UserRole } from '@/types/common'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title: string
    /** 允许访问的角色；缺省表示仅需登录 */
    roles?: UserRole[]
    /** 是否公开（无需登录） */
    public?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Index.vue'),
    meta: { title: '系统登录', public: true }
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        meta: { title: '首页工作台' }
      },
      {
        path: 'project',
        name: 'ProjectList',
        component: () => import('@/views/project/Index.vue'),
        meta: { title: '项目管理' }
      },
      {
        path: 'project/create',
        name: 'ProjectCreate',
        component: () => import('@/views/project/Create.vue'),
        meta: { title: '新增项目', roles: ['项目实施单位', '系统管理员'] }
      },
      {
        path: 'project/:id(\\d+)',
        name: 'ProjectDetail',
        component: () => import('@/views/project/Detail.vue'),
        meta: { title: '项目详情' }
      },
      {
        path: 'knowledge',
        name: 'Knowledge',
        component: () => import('@/views/knowledge/Index.vue'),
        meta: { title: '知识库' }
      },
      {
        path: 'issue',
        name: 'Issue',
        component: () => import('@/views/issue/Index.vue'),
        meta: { title: '问题库' }
      },
      {
        path: 'exp',
        name: 'Exp',
        component: () => import('@/views/exp/Index.vue'),
        meta: { title: '经验库' }
      },
      {
        path: 'bi',
        name: 'BI',
        component: () => import('@/views/bi/Index.vue'),
        meta: { title: 'BI 看板' }
      },
      {
        path: 'export',
        name: 'Export',
        component: () => import('@/views/export/Index.vue'),
        meta: { title: '数据导出' }
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/Index.vue'),
        meta: { title: '用户管理', roles: ['系统管理员'] }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/Index.vue'),
        meta: { title: '角色权限', roles: ['系统管理员'] }
      },
      {
        path: 'system/config',
        name: 'SystemConfig',
        component: () => import('@/views/system/config/Index.vue'),
        meta: { title: '系统配置', roles: ['系统管理员', '内容审核员'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '页面不存在', public: true }
  }
]

export default routes

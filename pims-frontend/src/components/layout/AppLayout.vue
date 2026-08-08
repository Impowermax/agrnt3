<script setup lang="ts">
/**
 * 整体布局：侧边导航 + 顶栏 + 主内容区（规范 4.4 AppLayout）
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  Odometer, Folder, Collection, WarningFilled, Star,
  DataAnalysis, Download, Setting, User, Lock, Tools,
  Expand, Fold, SwitchButton
} from '@element-plus/icons-vue'
import { useUserStore, useAppStore } from '@/stores'
import type { UserRole } from '@/types/common'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

interface MenuItem {
  path: string
  title: string
  icon: unknown
  roles?: UserRole[]
  children?: MenuItem[]
}

const MENUS: MenuItem[] = [
  { path: '/dashboard', title: '首页工作台', icon: Odometer },
  { path: '/project', title: '项目管理', icon: Folder },
  { path: '/knowledge', title: '知识库', icon: Collection },
  { path: '/issue', title: '问题库', icon: WarningFilled },
  { path: '/exp', title: '经验库', icon: Star },
  { path: '/bi', title: 'BI 看板', icon: DataAnalysis },
  { path: '/export', title: '数据导出', icon: Download },
  {
    path: '/system', title: '系统管理', icon: Setting,
    roles: ['系统管理员', '内容审核员'],
    children: [
      { path: '/system/user', title: '用户管理', icon: User, roles: ['系统管理员'] },
      { path: '/system/role', title: '角色权限', icon: Lock, roles: ['系统管理员'] },
      { path: '/system/config', title: '系统配置', icon: Tools, roles: ['系统管理员', '内容审核员'] }
    ]
  }
]

/** 按角色过滤菜单（规范 6.3：菜单权限） */
const visibleMenus = computed(() =>
  MENUS.filter((m) => !m.roles || userStore.hasRole(m.roles)).map((m) => ({
    ...m,
    children: m.children?.filter((c) => !c.roles || userStore.hasRole(c.roles))
  }))
)

const activeMenu = computed(() => {
  // 项目详情/新增高亮项目管理菜单
  if (route.path.startsWith('/project')) return '/project'
  return route.path
})

const breadcrumb = computed(() => route.meta.title || '')

async function handleLogout(): Promise<void> {
  await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <aside class="app-layout__sidebar" :class="{ 'app-layout__sidebar--collapsed': appStore.sidebarCollapsed }">
      <div class="app-layout__brand">
        <div class="app-layout__logo">投</div>
        <transition name="fade">
          <div v-show="!appStore.sidebarCollapsed" class="app-layout__brand-text">
            <span class="app-layout__brand-name">投资项目管理辅助系统</span>
            <span class="app-layout__brand-sub">PIMS · V1.0</span>
          </div>
        </transition>
      </div>
      <el-menu
        class="app-layout__menu"
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        background-color="transparent"
        text-color="#c9d4e5"
        active-text-color="#ffffff"
      >
        <template v-for="menu in visibleMenus" :key="menu.path">
          <el-sub-menu v-if="menu.children?.length" :index="menu.path">
            <template #title>
              <el-icon><component :is="menu.icon" /></el-icon><span>{{ menu.title }}</span>
            </template>
            <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">
              <el-icon><component :is="child.icon" /></el-icon><span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <el-icon><component :is="menu.icon" /></el-icon>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
      <div v-show="!appStore.sidebarCollapsed" class="app-layout__footer">
        © 2026 投资项目管理辅助系统
      </div>
    </aside>

    <!-- 主区域 -->
    <div class="app-layout__main" :class="{ 'app-layout__main--collapsed': appStore.sidebarCollapsed }">
      <header class="app-layout__header">
        <div class="app-layout__header-left">
          <el-icon class="app-layout__collapse-btn" @click="appStore.toggleSidebar">
            <Expand v-if="appStore.sidebarCollapsed" /><Fold v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>当前位置</el-breadcrumb-item>
            <el-breadcrumb-item><b>{{ breadcrumb }}</b></el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="app-layout__header-right">
          <el-tag size="small" effect="light">{{ userStore.userInfo?.role }}</el-tag>
          <span class="text-tertiary">{{ userStore.userInfo?.org }}</span>
          <el-dropdown>
            <span class="app-layout__user">
              <span class="app-layout__avatar">{{ userStore.userInfo?.name?.[0] }}</span>
              <span>{{ userStore.userInfo?.name }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <main class="app-layout__content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.app-layout {
  display: flex;
  min-height: 100vh;

  &__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--pims-sidebar-width);
    background: var(--pims-sidebar-bg);
    display: flex;
    flex-direction: column;
    z-index: 100;
    transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);

    &--collapsed {
      width: 64px;
    }
  }

  &__brand {
    height: var(--pims-header-height);
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    padding: 0 var(--pims-space-4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  &__logo {
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: var(--pims-radius-md);
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    color: #fff;
    font-weight: 600;
    @include flex-center;
  }

  &__brand-text {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
  }

  &__brand-name {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  &__brand-sub {
    color: #8fa3bf;
    font-size: 12px;
  }

  &__menu {
    flex: 1;
    overflow-y: auto;
    @include custom-scrollbar;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      margin: 2px var(--pims-space-2);
      border-radius: var(--pims-radius-md);
      height: 44px;
      line-height: 44px;

      &:hover {
        background: rgba(255, 255, 255, 0.07);
      }
    }

    :deep(.el-menu-item.is-active) {
      background: var(--pims-primary);
      color: #fff;
    }

    :deep(.el-menu .el-menu-item) {
      min-width: auto;
    }
  }

  &__footer {
    padding: var(--pims-space-3) var(--pims-space-4);
    font-size: 12px;
    color: #5f7291;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    white-space: nowrap;
  }

  &__main {
    flex: 1;
    margin-left: var(--pims-sidebar-width);
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: margin-left 250ms cubic-bezier(0.4, 0, 0.2, 1);

    &--collapsed {
      margin-left: 64px;
    }
  }

  &__header {
    height: var(--pims-header-height);
    background: #fff;
    border-bottom: 1px solid var(--pims-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--pims-space-6);
    position: sticky;
    top: 0;
    z-index: 90;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: var(--pims-space-4);
  }

  &__collapse-btn {
    cursor: pointer;
    font-size: 18px;
    color: var(--pims-text-secondary);
    transition: color 150ms ease-out;

    &:hover {
      color: var(--pims-primary);
    }
  }

  &__header-right {
    display: flex;
    align-items: center;
    gap: var(--pims-space-3);
    font-size: 13px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    cursor: pointer;
    color: var(--pims-text-primary);
  }

  &__avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--pims-primary);
    color: #fff;
    font-size: 13px;
    @include flex-center;
  }

  &__content {
    flex: 1;
  }
}
</style>

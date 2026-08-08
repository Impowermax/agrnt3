<script setup lang="ts">
/**
 * 角色权限（PRD 5.8 · 系统管理 - 角色权限配置）
 * 五类角色权限矩阵 + 功能模块对照
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import type { UserRole } from '@/types/common'

interface RolePermission {
  role: UserRole
  desc: string
  scope: string
  modules: string[]
  tagType: 'danger' | 'warning' | 'primary' | 'success' | 'info'
}

/** 角色权限定义（对应 PRD 6.3 角色权限矩阵） */
const ROLE_LIST: RolePermission[] = [
  {
    role: '系统管理员',
    desc: '系统全局管理：用户、角色、配置、审核、制度文件',
    scope: '全部数据',
    modules: ['用户管理', '角色权限', '系统配置', '内容审核', '制度文件', '项目管理', '知识库', 'BI 看板', '数据导出'],
    tagType: 'danger'
  },
  {
    role: '内容审核员',
    desc: '负责问题库、经验库内容审核与知识库维护',
    scope: '全部问题/经验数据',
    modules: ['内容审核', '制度文件', '知识库维护', '问题库查看', '经验库查看', '项目管理查看'],
    tagType: 'warning'
  },
  {
    role: '项目实施单位',
    desc: '项目实施全过程管理：录入实施情况、提交问题与经验',
    scope: '本单位项目数据',
    modules: ['新增项目', '项目详情', '实施情况录入', '问题提交', '经验提交', '知识库查看', '数据导出'],
    tagType: 'primary'
  },
  {
    role: '审批单位人员',
    desc: '项目立项、概算等审批环节审核与批复',
    scope: '待审批项目数据',
    modules: ['项目审批', '项目查看', 'BI 看板', '数据导出'],
    tagType: 'success'
  },
  {
    role: '管理层',
    desc: '全局统计查看、决策分析、报表导出',
    scope: '全局统计数据',
    modules: ['BI 看板', '项目查看', '数据导出', '统计报表'],
    tagType: 'info'
  }
]

const activeRole = ref<UserRole>('系统管理员')
const current = ref<RolePermission>(ROLE_LIST[0])

function selectRole(role: UserRole): void {
  activeRole.value = role
  current.value = ROLE_LIST.find((r) => r.role === role)!
}

function savePermission(): void {
  ElMessage.success('权限配置已保存（演示）')
}
</script>

<template>
  <div class="page-container">
    <PageHeader title="角色权限" description="系统五类角色权限配置 · 数据隔离：实施单位默认仅可查看本单位项目" />

    <div class="role-page__layout">
      <!-- 角色列表 -->
      <div class="pims-card role-page__sidebar">
        <div class="pims-card__title">系统角色</div>
        <div
          v-for="r in ROLE_LIST"
          :key="r.role"
          class="role-page__item"
          :class="{ 'role-page__item--active': activeRole === r.role }"
          @click="selectRole(r.role)"
        >
          <el-icon :size="18"><Lock /></el-icon>
          <div class="role-page__item-text">
            <div class="role-page__item-name">{{ r.role }}</div>
            <div class="role-page__item-desc">{{ r.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 权限详情 -->
      <div class="pims-card role-page__main">
        <div class="pims-card__title">
          <el-tag :type="current.tagType" effect="light">{{ current.role }}</el-tag>
          权限配置
          <el-button class="pims-card__extra" v-permission="['系统管理员']" type="primary" size="small" @click="savePermission">保存配置</el-button>
        </div>

        <el-descriptions :column="1" border>
          <el-descriptions-item label="角色名称">{{ current.role }}</el-descriptions-item>
          <el-descriptions-item label="职责说明">{{ current.desc }}</el-descriptions-item>
          <el-descriptions-item label="数据范围">{{ current.scope }}</el-descriptions-item>
          <el-descriptions-item label="功能模块">
            <el-tag
              v-for="m in current.modules"
              :key="m"
              size="small"
              effect="plain"
              style="margin: 2px 4px 2px 0"
            >{{ m }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="role-page__tip">
          <el-alert type="info" :closable="false">
            数据隔离规则：项目实施单位仅可查看与操作本单位项目；内容审核员可审核全部问题/经验提交内容；系统管理员拥有全部权限。菜单与按钮级权限通过路由 meta.roles 与 v-permission 指令实现。
          </el-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.role-page {
  &__layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: var(--pims-space-4);
    align-items: start;

    @include respond-to(lg) {
      grid-template-columns: 1fr;
    }
  }

  &__sidebar {
    position: sticky;
    top: calc(var(--pims-header-height) + var(--pims-space-4));
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    padding: var(--pims-space-3);
    border-radius: var(--pims-radius-md);
    cursor: pointer;
    transition: background 150ms ease-out;

    & + & {
      margin-top: var(--pims-space-1);
    }

    &:hover {
      background: var(--pims-surface);
    }

    &--active {
      background: var(--pims-primary-light);

      .role-page__item-name {
        color: var(--pims-primary);
      }
    }
  }

  &__item-text {
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--pims-text-primary);
  }

  &__item-desc {
    font-size: 12px;
    color: var(--pims-text-tertiary);
    margin-top: 2px;
  }

  &__main {
    min-height: 400px;
  }

  &__tip {
    margin-top: var(--pims-space-4);
  }
}
</style>

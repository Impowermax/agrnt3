<script setup lang="ts">
/**
 * 首页工作台（PRD：登录后主界面）
 * 统计概览 + 快捷入口 + 在建项目 + 待办事项 + 最新经验
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Folder, Coin, OfficeBuilding, Collection, Search,
  Star, DataAnalysis, Download, DocumentAdd
} from '@element-plus/icons-vue'
import StatCard from '@/components/business/StatCard.vue'
import ProjectCard from '@/components/business/ProjectCard.vue'
import { useProjectStore } from '@/stores'
import { getExpList } from '@/api/exp'
import { getBIStats } from '@/api/bi'
import { formatAmount, formatAmountYi } from '@/utils/format'
import type { Experience } from '@/types/exp'
import type { BIStats } from '@/types/system'
import type { Project } from '@/types/project'

const router = useRouter()
const projectStore = useProjectStore()

/** 计算两个 yyyy-MM-dd 日期之间相差天数（end - now），无效日期返回 NaN */
function diffDays(endDateStr: string): number {
  const end = new Date(endDateStr + 'T00:00:00')
  if (isNaN(end.getTime())) return NaN
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((end.getTime() - today.getTime()) / 86400000)
}

/**
 * 从项目列表中筛选出需要预警的项目：
 * - 非「建设完毕」状态（竣工项目不需要阶段预警）
 * - 当前阶段结束日期存在且有效
 * - 结束日期距今天 0 ~ 7 天内（包含 0 天即今日截止）
 */
interface StageWarning {
  project: Project
  days: number
  tag: '预警' | '即将截止' | '今日截止'
  tagType: 'danger' | 'warning'
}

const stageWarnings = computed<StageWarning[]>(() => {
  const result: StageWarning[] = []
  for (const p of projectStore.projectList) {
    if (p.status === '建设完毕') continue
    if (!p.stageEndDate) continue
    const days = diffDays(p.stageEndDate)
    if (isNaN(days) || days < 0 || days > 7) continue
    let tag: StageWarning['tag'] = '预警'
    let tagType: StageWarning['tagType'] = 'warning'
    if (days === 0) { tag = '今日截止'; tagType = 'danger' }
    else if (days <= 3) { tag = '即将截止'; tagType = 'danger' }
    result.push({ project: p, days, tag, tagType })
  }
  result.sort((a, b) => a.days - b.days)
  return result
})

const stats = ref<BIStats | null>(null)
const latestExps = ref<Experience[]>([])

/** 项目分类统计 */
const projectStats = computed(() => {
  const all = projectStore.projectList
  const fixed = all.filter((p) => p.type === '固定资产投资项目')
  const info = all.filter((p) => p.type === '信息化投资项目')
  return {
    total: all.length,
    fixed: {
      total: fixed.length,
      planned: fixed.filter((p) => p.status === '拟建项目').length,
      building: fixed.filter((p) => p.status === '在建项目').length,
      completed: fixed.filter((p) => p.status === '建设完毕').length
    },
    info: {
      total: info.length,
      planned: info.filter((p) => p.status === '拟建项目').length,
      building: info.filter((p) => p.status === '在建项目').length,
      completed: info.filter((p) => p.status === '建设完毕').length
    }
  }
})

const quickEntries = [
  { title: '新增项目', icon: DocumentAdd, path: '/project/create' },
  { title: '项目列表', icon: Folder, path: '/project' },
  { title: '问题检索', icon: Search, path: '/issue' },
  { title: '经验共享', icon: Star, path: '/exp' },
  { title: 'BI 看板', icon: DataAnalysis, path: '/bi' },
  { title: '数据导出', icon: Download, path: '/export' }
]

const todos = [
  { tag: '实施情况', type: 'primary' as const, text: '录入「施工过程管理 - 进度款支付」实施情况', project: '市公司卷烟物流配送中心建设项目' },
  { tag: '审核', type: 'success' as const, text: '「工程量清单审核」问题记录审核通过，已公开', project: '系统消息' },
  { tag: '待审核', type: 'warning' as const, text: '提交的经验「清单三级审核把关机制」待审核', project: '城区分公司办公楼改造项目' },
  { tag: '提醒', type: 'danger' as const, text: '项目决算审计材料补充提醒', project: '仓储智能化改造项目' }
]

onMounted(async () => {
  await projectStore.fetchList()
  stats.value = await getBIStats()
  latestExps.value = (await getExpList({ keyword: '', stageId: '', step: '' })).slice(0, 3)
})
</script>

<template>
  <div class="page-container">
    <!-- 快捷入口 -->
    <div class="pims-card">
      <div class="pims-card__title">快捷入口</div>
      <div class="dashboard__quick">
        <div v-for="entry in quickEntries" :key="entry.path" class="dashboard__quick-item" @click="router.push(entry.path)">
          <el-icon :size="22" color="var(--pims-primary)"><component :is="entry.icon" /></el-icon>
          <span>{{ entry.title }}</span>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="dashboard__stats">
      <!-- 本年度投资项目总数 -->
      <div class="pims-card stat-group stat-group--overview">
        <div class="stat-group__header">
          <span class="stat-group__title">本年度投资项目总数</span>
          <span class="stat-group__total num">{{ projectStats.total }}<small>个</small></span>
        </div>
        <div class="stat-group__items">
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.fixed.total }}</div>
            <div class="stat-group__label">固定资产投资项目</div>
          </div>
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.info.total }}</div>
            <div class="stat-group__label">信息化投资项目</div>
          </div>
        </div>
      </div>

      <!-- 固定资产投资项目 -->
      <div class="pims-card stat-group">
        <div class="stat-group__header">
          <span class="stat-group__title">固定资产投资项目</span>
          <span class="stat-group__total num">{{ projectStats.fixed.total }}<small>个</small></span>
        </div>
        <div class="stat-group__items">
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.fixed.planned }}</div>
            <div class="stat-group__label">拟建项目</div>
          </div>
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.fixed.building }}</div>
            <div class="stat-group__label">在建项目</div>
          </div>
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.fixed.completed }}</div>
            <div class="stat-group__label">竣工项目</div>
          </div>
        </div>
      </div>

      <!-- 信息化投资项目 -->
      <div class="pims-card stat-group">
        <div class="stat-group__header">
          <span class="stat-group__title">信息化投资项目</span>
          <span class="stat-group__total num">{{ projectStats.info.total }}<small>个</small></span>
        </div>
        <div class="stat-group__items">
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.info.planned }}</div>
            <div class="stat-group__label">拟建项目</div>
          </div>
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.info.building }}</div>
            <div class="stat-group__label">在建项目</div>
          </div>
          <div class="stat-group__item">
            <div class="stat-group__num num">{{ projectStats.info.completed }}</div>
            <div class="stat-group__label">竣工项目</div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard__cols">
      <div>
        <!-- 在建项目 -->
        <div class="pims-card">
          <div class="pims-card__title">
            我单位在建项目
            <el-link class="pims-card__extra" :underline="false" @click="router.push('/project')">全部项目 →</el-link>
          </div>
          <div class="dashboard__projects">
            <ProjectCard
              v-for="project in projectStore.projectList.slice(0, 4)"
              :key="project.id"
              :project="project"
              @card-click="router.push(`/project/${project.id}`)"
            />
          </div>
        </div>
      </div>

      <div>
        <!-- 待办事项 -->
        <div class="pims-card dashboard__todo-card">
          <div class="pims-card__title">
            待办事项
            <el-badge v-if="stageWarnings.length" :value="stageWarnings.length" type="danger" style="margin-left: 4px" />
          </div>

          <div class="dashboard__todo-list">
            <!-- 阶段预警提示（动态） -->
            <div
              v-for="w in stageWarnings"
              :key="'w-' + w.project.id"
              class="dashboard__todo dashboard__todo--warn"
              @click="router.push(`/project/${w.project.id}`)"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-tag size="small" :type="w.tagType" effect="dark">{{ w.tag }}</el-tag>
                <span style="font-size: 13px">
                  距离「{{ w.project.stage }}」阶段结束还剩
                  <b style="color: var(--pims-danger); margin: 0 2px">{{ w.days }}</b>
                  天，请高度关注施工进度
                </span>
              </div>
              <div class="text-tertiary" style="margin-top: 4px">{{ w.project.name }}</div>
            </div>

            <!-- 静态待办（原有内容） -->
            <div v-for="(todo, i) in todos" :key="'t-' + i" class="dashboard__todo">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-tag size="small" :type="todo.type">{{ todo.tag }}</el-tag>
                <span style="font-size: 13px">{{ todo.text }}</span>
              </div>
              <div class="text-tertiary" style="margin-top: 4px">{{ todo.project }}</div>
            </div>
          </div>
        </div>

        <!-- 最新经验 -->
        <div class="pims-card">
          <div class="pims-card__title">
            最新经验共享
            <el-link class="pims-card__extra" :underline="false" @click="router.push('/exp')">更多 →</el-link>
          </div>
          <div v-for="exp in latestExps" :key="exp.id" class="dashboard__exp" @click="router.push('/exp')">
            <div class="dashboard__exp-title">
              <el-icon color="var(--pims-success)"><Star /></el-icon>{{ exp.title }}
            </div>
            <div class="text-tertiary" style="margin-top: 4px">{{ exp.stage }} · {{ exp.step }} · {{ exp.date }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.dashboard {
  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--pims-space-4);
    margin-bottom: var(--pims-space-4);

    @include respond-to(lg) {
      grid-template-columns: 1fr;
    }
  }

  &__cols {
    display: grid;
    grid-template-columns: 1.7fr 1fr;
    gap: var(--pims-space-4);
    align-items: start;

    @include respond-to(lg) {
      grid-template-columns: 1fr;
    }
  }

  &__quick {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--pims-space-3);
  }

  &__quick-item {
    border: 1px solid var(--pims-border);
    border-radius: var(--pims-radius-lg);
    padding: var(--pims-space-4);
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--pims-space-2);
    font-size: 13px;
    transition: border-color 150ms ease-out, box-shadow 150ms ease-out;

    &:hover {
      border-color: var(--pims-primary);
      box-shadow: var(--pims-shadow-sm);
    }
  }

  &__projects {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--pims-space-3);
  }

  &__todo-card {
    display: flex;
    flex-direction: column;
    max-height: 420px;
  }

  &__todo-list {
    flex: 1;
    overflow-y: auto;
    margin: 0 -8px;
    padding: 0 8px;

    /* 美化滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--pims-border);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--pims-text-tertiary);
    }
  }

  &__todo {
    padding: 11px 0;
    border-bottom: 1px dashed var(--pims-border);

    &:last-child {
      border-bottom: none;
    }

    &--warn {
      cursor: pointer;
      padding-left: 8px;
      border-left: 3px solid var(--pims-danger);
      padding-right: 8px;
      margin-left: -8px;
      margin-right: -8px;
      border-radius: 0 var(--pims-radius-md) var(--pims-radius-md) 0;
      transition: background-color 150ms ease-out;

      &:hover {
        background-color: var(--pims-danger-light);
      }
    }
  }

  &__exp {
    padding: 11px 0;
    border-bottom: 1px dashed var(--pims-border);
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }
  }

  &__exp-title {
    display: flex;
    align-items: center;
    gap: var(--pims-space-1);
    font-size: 13px;
    font-weight: 500;
  }
}

/* 统计卡片 - 分类统计 */
.stat-group {
  display: flex;
  flex-direction: column;
  gap: var(--pims-space-3);

  &--overview &__items {
    grid-template-columns: repeat(2, 1fr);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--pims-space-2);
    border-bottom: 2px solid var(--pims-primary-light);
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--pims-text-primary);
  }

  &__total {
    font-size: 24px;
    font-weight: 700;
    color: var(--pims-primary);

    small {
      font-size: 13px;
      font-weight: 400;
      margin-left: 2px;
    }
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--pims-space-2);
  }

  &__item {
    text-align: center;
    padding: var(--pims-space-2) 0;
    background: var(--pims-surface);
    border-radius: var(--pims-radius-md);
  }

  &__num {
    font-size: 28px;
    font-weight: 700;
    color: var(--pims-text-primary);
    line-height: 1.2;
  }

  &__label {
    font-size: 12px;
    color: var(--pims-text-tertiary);
    margin-top: 2px;
  }
}
</style>

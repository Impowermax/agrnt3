<script setup lang="ts">
/**
 * 首页工作台（PRD：登录后主界面）
 * 统计概览 + 快捷入口 + 在建项目 + 待办事项 + 最新经验
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Folder, Coin, OfficeBuilding, Collection, EditPen, Search,
  Star, DataAnalysis, Download, DocumentAdd
} from '@element-plus/icons-vue'
import StatCard from '@/components/business/StatCard.vue'
import ProjectCard from '@/components/business/ProjectCard.vue'
import { useUserStore, useProjectStore } from '@/stores'
import { getExpList } from '@/api/exp'
import { getBIStats } from '@/api/bi'
import { formatAmount, formatAmountYi } from '@/utils/format'
import type { Experience } from '@/types/exp'
import type { BIStats } from '@/types/system'

const router = useRouter()
const userStore = useUserStore()
const projectStore = useProjectStore()

const stats = ref<BIStats | null>(null)
const latestExps = ref<Experience[]>([])

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
  await projectStore.fetchList({ status: '在建项目' })
  stats.value = await getBIStats()
  latestExps.value = (await getExpList({ keyword: '', stageId: '', step: '' })).slice(0, 3)
})
</script>

<template>
  <div class="page-container">
    <!-- 欢迎区 -->
    <div class="pims-card dashboard__welcome">
      <div>
        <h2 class="dashboard__hello">您好，{{ userStore.userInfo?.name }}</h2>
        <p class="text-tertiary" style="margin-top: 4px">欢迎使用投资项目管理辅助系统，今天是 2026年8月2日 星期日</p>
      </div>
      <div style="display: flex; gap: 8px">
        <el-button :icon="Collection" @click="router.push('/knowledge')">查看知识库</el-button>
        <el-button v-permission="['项目实施单位', '系统管理员']" type="primary" :icon="EditPen" @click="router.push('/project/create')">
          新增项目
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="dashboard__stats">
      <StatCard :value="stats?.projectTotal ?? '-'" label="投资项目总数" unit="个" :icon="Folder" icon-bg="var(--pims-primary-light)" />
      <StatCard :value="stats ? formatAmountYi(stats.amountTotal) : '-'" label="项目总投资额" unit="亿元" :icon="Coin" icon-bg="#ECFDF5" />
      <StatCard :value="stats?.buildingCount ?? '-'" label="在建项目" unit="个" :icon="OfficeBuilding" icon-bg="#FFFBEB" />
      <StatCard :value="stats?.issueTotal ?? '-'" label="已收录问题" unit="条" :icon="Collection" icon-bg="#F5F3FF" />
    </div>

    <div class="dashboard__cols">
      <div>
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
        <div class="pims-card">
          <div class="pims-card__title">待办事项</div>
          <div v-for="(todo, i) in todos" :key="i" class="dashboard__todo">
            <div style="display: flex; align-items: center; gap: 8px">
              <el-tag size="small" :type="todo.type">{{ todo.tag }}</el-tag>
              <span style="font-size: 13px">{{ todo.text }}</span>
            </div>
            <div class="text-tertiary" style="margin-top: 4px">{{ todo.project }}</div>
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
  &__welcome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--pims-space-4);
  }

  &__hello {
    font-size: 20px;
    font-weight: 500;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--pims-space-4);
    margin-bottom: var(--pims-space-4);
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

  &__todo {
    padding: 11px 0;
    border-bottom: 1px dashed var(--pims-border);

    &:last-child {
      border-bottom: none;
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
</style>

<script setup lang="ts">
/**
 * 项目列表（PRD 5.2.1）
 * 按状态分类展示 + 名称/类型/阶段筛选 + 新增项目入口
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import SearchFilter from '@/components/business/SearchFilter.vue'
import StatusBadge from '@/components/business/StatusBadge.vue'
import EmptyState from '@/components/layout/EmptyState.vue'
import { useProjectStore, useKnowledgeStore } from '@/stores'
import { useSearch } from '@/composables/useSearch'
import { useTable } from '@/composables/useTable'
import { formatAmount } from '@/utils/format'
import type { ProjectStatus } from '@/types/project'
import type { FilterConfig } from '@/types/common'

const router = useRouter()
const projectStore = useProjectStore()
const knowledgeStore = useKnowledgeStore()

const activeStatus = ref<ProjectStatus | ''>('')

const STATUS_TABS: { label: string; value: ProjectStatus | '' }[] = [
  { label: '全部', value: '' },
  { label: '新增项目', value: '新增项目' },
  { label: '拟建项目', value: '拟建项目' },
  { label: '在建项目', value: '在建项目' },
  { label: '建设完毕', value: '建设完毕' }
]

const { list, pagedList, loading, pageNum, pageSize, total, load, handlePageChange, handleSizeChange } =
  useTable({ fetcher: () => projectStore.projectList, immediate: false })

const { query, search, reset } = useSearch({
  defaultQuery: { keyword: '', type: '', stage: '' },
  onSearch: async (q) => {
    await projectStore.fetchList({ ...q, status: activeStatus.value })
    await load()
  }
})

const filters = computed<FilterConfig[]>(() => [
  { key: 'keyword', label: '项目名称', type: 'input', placeholder: '请输入项目名称关键字' },
  {
    key: 'type', label: '项目类型', type: 'select',
    options: [
      { label: '固定资产投资项目', value: '固定资产投资项目' },
      { label: '信息化投资项目', value: '信息化投资项目' }
    ]
  },
  {
    key: 'stage', label: '当前阶段', type: 'select',
    options: knowledgeStore.stages.map((s) => ({ label: s.name, value: s.name }))
  }
])

function statusCount(status: ProjectStatus | ''): number {
  // 列表数量统计基于已加载数据（演示口径）
  return status ? projectStore.projectList.filter((p) => p.status === status).length : total.value
}

async function switchStatus(status: ProjectStatus | ''): Promise<void> {
  activeStatus.value = status
  await projectStore.fetchList({ ...query.value, status })
  await load()
}

onMounted(async () => {
  await knowledgeStore.fetchStages()
  await projectStore.fetchList()
  await load()
})
</script>

<template>
  <div class="page-container">
    <div class="pims-card">
      <el-tabs :model-value="activeStatus" @tab-change="(v: string | number) => switchStatus(v as ProjectStatus | '')">
        <el-tab-pane v-for="tab in STATUS_TABS" :key="tab.value" :name="tab.value">
          <template #label>
            {{ tab.label }}
            <el-badge v-if="tab.value === '' || tab.value === activeStatus" :value="statusCount(tab.value)" :max="99" type="primary" style="margin-left: 4px" />
          </template>
        </el-tab-pane>
      </el-tabs>

      <SearchFilter v-model="query" :filters="filters" @search="search" @reset="reset">
        <template #extra>
          <el-button v-permission="['项目实施单位', '系统管理员']" type="primary" :icon="Plus" @click="router.push('/project/create')">
            新增项目
          </el-button>
        </template>
      </SearchFilter>
    </div>

    <div class="pims-card">
      <div class="pims-card__title">
        {{ activeStatus || '全部' }}项目列表
        <span class="pims-card__extra">共 {{ total }} 个项目</span>
      </div>

      <el-table v-loading="loading" :data="pagedList" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" :index="(i: number) => (pageNum - 1) * pageSize + i + 1" />
        <el-table-column label="项目名称" min-width="230" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="router.push(`/project/${row.id}`)">{{ row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="项目类型" width="150">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="row.type === '信息化投资项目' ? 'warning' : 'primary'">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="当前阶段" width="130" />
        <el-table-column label="项目状态" width="110">
          <template #default="{ row }"><StatusBadge :status="row.status" size="small" /></template>
        </el-table-column>
        <el-table-column label="投资金额（万元）" width="140" align="right">
          <template #default="{ row }"><span class="num">{{ formatAmount(row.amount) }}</span></template>
        </el-table-column>
        <el-table-column prop="date" label="立项时间" width="110" />
        <el-table-column prop="manager" label="负责人" width="90" />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="router.push(`/project/${row.id}`)">详情</el-button>
            <el-button v-permission="['项目实施单位', '系统管理员']" text type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <EmptyState text="暂无符合条件的项目，请调整筛选条件">
            <el-button type="primary" :icon="Plus" @click="router.push('/project/create')">新增项目</el-button>
          </EmptyState>
        </template>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          background
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

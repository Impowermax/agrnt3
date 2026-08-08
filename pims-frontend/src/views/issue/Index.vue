<script setup lang="ts">
/**
 * 问题库（PRD 5.4）
 * 卡片式展示已审核问题 + 关键字/阶段/环节组合检索 + 详情弹窗
 */
import { computed, onMounted, ref, watch } from 'vue'
import SearchFilter from '@/components/business/SearchFilter.vue'
import IssueItem from '@/components/business/IssueItem.vue'
import EmptyState from '@/components/layout/EmptyState.vue'
import StatusBadge from '@/components/business/StatusBadge.vue'
import { useIssueStore, useKnowledgeStore } from '@/stores'
import { useSearch } from '@/composables/useSearch'
import type { FilterConfig } from '@/types/common'
import type { Issue } from '@/types/issue'

const issueStore = useIssueStore()
const knowledgeStore = useKnowledgeStore()

const { query, search, reset } = useSearch({
  defaultQuery: { keyword: '', stageId: '' as number | '', step: '' },
  onSearch: (q) => issueStore.fetchList(q)
})

const stageOptions = computed(() => knowledgeStore.stages.map((s) => ({ label: s.name, value: s.id })))

const stepOptions = computed(() => {
  if (query.value.stageId) {
    const stage = knowledgeStore.stages.find((s) => s.id === Number(query.value.stageId))
    return (stage?.steps ?? []).map((s) => ({ label: s.name, value: s.name }))
  }
  return [...new Set(issueStore.issueList.map((i) => i.step))].map((s) => ({ label: s, value: s }))
})

const filters = computed<FilterConfig[]>(() => [
  { key: 'keyword', label: '关键字搜索', type: 'input', placeholder: '问题内容模糊匹配，如：估算、合同、清单' },
  { key: 'stageId', label: '项目阶段', type: 'select', options: stageOptions.value },
  { key: 'step', label: '关键环节 / 实施步骤', type: 'select', options: stepOptions.value }
])

/* 阶段变更时清空环节并重新查询 */
watch(() => query.value.stageId, () => {
  query.value = { ...query.value, step: '' }
  search()
})

/* 详情弹窗 */
const detailVisible = ref(false)
const currentIssue = ref<Issue | null>(null)

function showDetail(issue: Issue): void {
  currentIssue.value = issue
  detailVisible.value = true
}

onMounted(async () => {
  await knowledgeStore.fetchStages()
  await issueStore.fetchList({ keyword: '', stageId: '', step: '' })
})
</script>

<template>
  <div class="page-container">
    <div class="pims-card">
      <SearchFilter v-model="query" :filters="filters" @search="search" @reset="reset">
        <template #extra>
          <span class="text-tertiary">仅展示<b>已审核通过</b>并公开的问题 · 共 <b>{{ issueStore.issueList.length }}</b> 条</span>
        </template>
      </SearchFilter>
    </div>

    <div v-loading="issueStore.loading">
      <div v-if="issueStore.issueList.length" class="issue-page__grid">
        <IssueItem v-for="issue in issueStore.issueList" :key="issue.id" :issue="issue" @item-click="showDetail" />
      </div>
      <div v-else class="pims-card">
        <EmptyState text="未检索到相关问题记录，请调整检索条件" />
      </div>
    </div>

    <!-- 问题详情弹窗 -->
    <el-dialog v-model="detailVisible" title="问题详情" width="640px">
      <template v-if="currentIssue">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="所属阶段">{{ currentIssue.stage }}</el-descriptions-item>
          <el-descriptions-item label="关键环节">{{ currentIssue.step }}</el-descriptions-item>
          <el-descriptions-item label="关联项目">{{ currentIssue.project }}</el-descriptions-item>
          <el-descriptions-item label="录入时间"><span class="num">{{ currentIssue.date }}</span></el-descriptions-item>
          <el-descriptions-item label="审核状态" :span="2"><StatusBadge status="审核通过" size="small" /></el-descriptions-item>
        </el-descriptions>
        <div class="issue-page__detail-desc">{{ currentIssue.desc }}</div>
        <el-alert type="info" :closable="false">
          提示：在项目管理模块的对应环节中，可查看本问题的关联上下文并提交新的问题记录。
        </el-alert>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关 闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.issue-page {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: var(--pims-space-4);
  }

  &__detail-desc {
    font-size: 14px;
    line-height: 2;
    color: var(--pims-text-primary);
    margin: var(--pims-space-4) 0;
    padding: var(--pims-space-3);
    background: var(--pims-surface-muted);
    border-radius: var(--pims-radius-md);
  }
}
</style>

<script setup lang="ts">
/**
 * 经验库（PRD 5.5）
 * 卡片式展示已审核经验 + 关键字/阶段/环节组合检索 + 详情弹窗
 */
import { computed, onMounted, ref, watch } from 'vue'
import SearchFilter from '@/components/business/SearchFilter.vue'
import ExpItem from '@/components/business/ExpItem.vue'
import EmptyState from '@/components/layout/EmptyState.vue'
import StatusBadge from '@/components/business/StatusBadge.vue'
import { useExpStore, useKnowledgeStore } from '@/stores'
import { useSearch } from '@/composables/useSearch'
import type { FilterConfig } from '@/types/common'
import type { Experience } from '@/types/exp'

const expStore = useExpStore()
const knowledgeStore = useKnowledgeStore()

const { query, search, reset } = useSearch({
  defaultQuery: { keyword: '', stageId: '' as number | '', step: '' },
  onSearch: (q) => expStore.fetchList(q)
})

const stageOptions = computed(() => knowledgeStore.stages.map((s) => ({ label: s.name, value: s.id })))

const stepOptions = computed(() => {
  if (query.value.stageId) {
    const stage = knowledgeStore.stages.find((s) => s.id === Number(query.value.stageId))
    return (stage?.steps ?? []).map((s) => ({ label: s.name, value: s.name }))
  }
  return [...new Set(expStore.expList.map((e) => e.step))].map((s) => ({ label: s, value: s }))
})

const filters = computed<FilterConfig[]>(() => [
  { key: 'keyword', label: '关键字搜索', type: 'input', placeholder: '经验内容模糊匹配，如：清单、验收、台账' },
  { key: 'stageId', label: '项目阶段', type: 'select', options: stageOptions.value },
  { key: 'step', label: '关键环节 / 实施步骤', type: 'select', options: stepOptions.value }
])

watch(() => query.value.stageId, () => {
  query.value = { ...query.value, step: '' }
  search()
})

const detailVisible = ref(false)
const currentExp = ref<Experience | null>(null)

function showDetail(exp: Experience): void {
  currentExp.value = exp
  detailVisible.value = true
}

onMounted(async () => {
  await knowledgeStore.fetchStages()
  await expStore.fetchList({ keyword: '', stageId: '', step: '' })
})
</script>

<template>
  <div class="page-container">
    <div class="pims-card">
      <SearchFilter v-model="query" :filters="filters" @search="search" @reset="reset">
        <template #extra>
          <span class="text-tertiary">仅展示<b>已审核通过</b>并公开的经验做法 · 共 <b>{{ expStore.expList.length }}</b> 条</span>
        </template>
      </SearchFilter>
    </div>

    <div v-loading="expStore.loading">
      <div v-if="expStore.expList.length" class="exp-page__grid">
        <ExpItem v-for="exp in expStore.expList" :key="exp.id" :exp="exp" @item-click="showDetail" />
      </div>
      <div v-else class="pims-card">
        <EmptyState text="未检索到相关经验记录，请调整检索条件" />
      </div>
    </div>

    <!-- 经验详情弹窗 -->
    <el-dialog v-model="detailVisible" title="经验详情" width="640px">
      <template v-if="currentExp">
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px">{{ currentExp.title }}</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="所属阶段">{{ currentExp.stage }}</el-descriptions-item>
          <el-descriptions-item label="关键环节">{{ currentExp.step }}</el-descriptions-item>
          <el-descriptions-item label="关联项目">{{ currentExp.project }}</el-descriptions-item>
          <el-descriptions-item label="录入时间"><span class="num">{{ currentExp.date }}</span></el-descriptions-item>
          <el-descriptions-item label="审核状态" :span="2"><StatusBadge status="审核通过" size="small" /></el-descriptions-item>
        </el-descriptions>
        <div class="exp-page__detail-desc">{{ currentExp.desc }}</div>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关 闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.exp-page {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: var(--pims-space-4);
  }

  &__detail-desc {
    font-size: 14px;
    line-height: 2;
    color: var(--pims-text-primary);
    margin-top: var(--pims-space-4);
    padding: var(--pims-space-3);
    background: var(--pims-surface-muted);
    border-radius: var(--pims-radius-md);
  }
}
</style>

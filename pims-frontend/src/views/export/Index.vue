<script setup lang="ts">
/**
 * 数据导出（PRD 5.7）
 * 表单式内容导出：选择项目/阶段/字段 → 预览 → 导出 Excel（CSV）
 */
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { View, Download } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import EmptyState from '@/components/layout/EmptyState.vue'
import { useProjectStore, useKnowledgeStore } from '@/stores'
import { getExpList } from '@/api/exp'
import { exportProjectContent } from '@/api/system'
import { exportTableToCsv } from '@/utils/download'
import type { Stage, StepInfo } from '@/types/project'
import type { Experience } from '@/types/exp'

const projectStore = useProjectStore()
const knowledgeStore = useKnowledgeStore()

const projectId = ref<number>(1)
const stageId = ref<number | ''>('')
const fields = ref<string[]>(['req', 'notice', 'risk', 'law'])
const experiences = ref<Experience[]>([])
const exporting = ref(false)

/** 可导出字段定义 */
const FIELD_DEFS: { key: string; label: string }[] = [
  { key: 'req', label: '工作要求' },
  { key: 'notice', label: '注意事项' },
  { key: 'risk', label: '潜在风险' },
  { key: 'law', label: '法律政策制度依据' },
  { key: 'exp', label: '经验共享' }
]

/** 选中阶段下的所有环节（按阶段展开） */
const previewRows = computed<{ stage: Stage; step: StepInfo; exp: string }[]>(() => {
  const stages = stageId.value
    ? knowledgeStore.stages.filter((s) => s.id === stageId.value)
    : knowledgeStore.stages
  return stages.flatMap((s) =>
    s.steps.map((sp) => {
      const exp = experiences.value.find((e) => e.step === sp.name && e.stageId === s.id)
      return { stage: s, step: sp, exp: exp?.desc || '—' }
    })
  )
})

/** 选中字段的表头 */
const selectedFieldLabels = computed(() =>
  FIELD_DEFS.filter((f) => fields.value.includes(f.key)).map((f) => f.label)
)

/** 取某环节某字段的值 */
function fieldValue(step: StepInfo, exp: string, key: string): string {
  if (key === 'exp') return exp
  return (step[key as keyof StepInfo] as string) || '—'
}

const projectName = computed(() => projectStore.projectList.find((p) => p.id === projectId.value)?.name || '')

async function handleExport(): Promise<void> {
  if (!fields.value.length) {
    ElMessage.warning('请至少选择一个导出字段')
    return
  }
  exporting.value = true
  try {
    await exportProjectContent(projectId.value, fields.value, stageId.value || undefined)
    // 演示：前端生成 CSV 作为 Excel 替代（真实场景由后端生成 .xlsx）
    const headers = ['序号', '项目阶段', '关键环节', ...selectedFieldLabels.value]
    const rows = previewRows.value.map((r, i) => [
      i + 1,
      r.stage.name,
      r.step.name,
      ...fields.value.map((k) => fieldValue(r.step, r.exp, k))
    ])
    exportTableToCsv(headers, rows, `${projectName.value}_全周期内容`)
    ElMessage.success('导出文件已生成')
  } finally {
    exporting.value = false
  }
}

onMounted(async () => {
  await Promise.all([projectStore.fetchList(), knowledgeStore.fetchStages()])
  experiences.value = await getExpList({ keyword: '', stageId: '', step: '' })
})
</script>

<template>
  <div class="page-container">
    <PageHeader title="数据导出" description="表单式导出项目全生命周期内容（工作要求 / 注意事项 / 风险 / 依据 / 经验）" />

    <!-- 导出条件 -->
    <div class="pims-card">
      <div class="pims-card__title">表单式内容导出（Excel）</div>
      <div class="export__form">
        <div class="export__field">
          <label class="export__label"><span class="export__req">*</span>选择项目</label>
          <el-select v-model="projectId" placeholder="请选择项目" style="width: 100%">
            <el-option v-for="p in projectStore.projectList" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </div>
        <div class="export__field">
          <label class="export__label">项目阶段（默认全部）</label>
          <el-select v-model="stageId" placeholder="全部阶段" clearable style="width: 100%">
            <el-option v-for="s in knowledgeStore.stages" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </div>
        <div class="export__field export__field--full">
          <label class="export__label">导出字段（按选取字段以表单式导出）</label>
          <el-checkbox-group v-model="fields">
            <el-checkbox v-for="f in FIELD_DEFS" :key="f.key" :value="f.key">{{ f.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="export__actions">
        <el-button :icon="View" @click="() => {}">预 览</el-button>
        <el-button type="primary" :icon="Download" :loading="exporting" @click="handleExport">导出 Excel</el-button>
      </div>
    </div>

    <!-- 预览表格 -->
    <div class="pims-card">
      <div class="pims-card__title">
        导出内容预览
        <span class="pims-card__extra">共 {{ previewRows.length }} 个关键环节 · {{ selectedFieldLabels.length }} 个导出字段</span>
      </div>
      <el-table :data="previewRows" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="项目阶段" width="140">
          <template #default="{ row }">{{ row.stage.name }}</template>
        </el-table-column>
        <el-table-column label="关键环节" width="150">
          <template #default="{ row }">{{ row.step.name }}</template>
        </el-table-column>
        <el-table-column
          v-for="f in FIELD_DEFS.filter((x) => fields.includes(x.key))"
          :key="f.key"
          :label="f.label"
          min-width="240"
        >
          <template #default="{ row }">
            <span class="export__cell">{{ fieldValue(row.step, row.exp, f.key) }}</span>
          </template>
        </el-table-column>
        <template #empty>
          <EmptyState text="请选择项目与导出字段后查看预览" />
        </template>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.export {
  &__form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--pims-space-4);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--pims-space-2);

    &--full {
      grid-column: 1 / -1;
    }
  }

  &__label {
    font-size: 13px;
    color: var(--pims-text-secondary);
  }

  &__req {
    color: var(--pims-danger);
    margin-right: 2px;
  }

  &__actions {
    display: flex;
    gap: var(--pims-space-2);
    margin-top: var(--pims-space-4);
  }

  &__cell {
    font-size: 12.5px;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>

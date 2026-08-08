<script setup lang="ts">
/**
 * 知识库（PRD 5.3）
 * 全生命周期管理流程只读展示 + 制度文件在线学习
 */
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Download, View, Document } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import KnowledgeTree from '@/components/business/KnowledgeTree.vue'
import { useKnowledgeStore } from '@/stores'

const knowledgeStore = useKnowledgeStore()

/** 项目类别筛选 */
const selectedCategory = ref<'固定资产投资项目' | '信息化投资项目'>('固定资产投资项目')

/** 按项目类别筛选阶段（信息化投资项目取前 9 个阶段） */
const filteredStages = computed(() =>
  selectedCategory.value === '信息化投资项目'
    ? knowledgeStore.stages.slice(0, 9)
    : knowledgeStore.stages
)

/** 切换项目类别时重置选中状态 */
function switchCategory(val: string): void {
  selectedCategory.value = val as typeof selectedCategory.value
  const first = filteredStages.value[0]
  if (first) {
    knowledgeStore.select(first.id, 0)
  }
}

const activeStage = computed(
  () => filteredStages.value.find((s) => s.id === knowledgeStore.activeStageId) ?? filteredStages.value[0]
)
const activeStep = computed(() => activeStage.value?.steps[knowledgeStore.activeStepIndex])

const SECTIONS = computed(() => [
  { key: 'req', title: '工作要求', content: activeStep.value?.req, color: 'var(--pims-primary)' },
  { key: 'law', title: '法律政策制度依据', content: activeStep.value?.law, color: '#8b5cf6' },
  { key: 'notice', title: '注意事项', content: activeStep.value?.notice, color: 'var(--pims-warning)' },
  { key: 'risk', title: '潜在风险', content: activeStep.value?.risk, color: 'var(--pims-danger)' }
])

onMounted(async () => {
  await knowledgeStore.fetchStages()
  await knowledgeStore.fetchPolicyFiles()
})
</script>

<template>
  <div class="page-container" v-loading="knowledgeStore.loading">
    <PageHeader title="知识库" />

    <!-- 项目类别筛选 -->
    <div class="pims-card knowledge__filter">
      <span class="knowledge__filter-label">项目类别：</span>
      <el-select v-model="selectedCategory" style="width: 220px" @change="switchCategory">
        <el-option label="固定资产投资项目" value="固定资产投资项目" />
        <el-option label="信息化投资项目" value="信息化投资项目" />
      </el-select>
    </div>

    <DetailLayout>
      <template #aside>
        <KnowledgeTree
          :stages="filteredStages"
          :active-stage-id="knowledgeStore.activeStageId"
          :active-step-index="knowledgeStore.activeStepIndex"
          @select="knowledgeStore.select"
        />
      </template>

      <div v-if="activeStage && activeStep">
        <div class="pims-card" style="margin-bottom: 12px">
          <div class="text-tertiary">第 {{ activeStage.id }} 阶段 · {{ activeStage.name }}</div>
          <div style="font-size: 16px; font-weight: 600; margin-top: 2px">{{ activeStep.name }}</div>
        </div>

        <div v-for="sec in SECTIONS" :key="sec.key" class="knowledge__section">
          <div class="knowledge__head">
            <span class="knowledge__dot" :style="{ background: sec.color }" />{{ sec.title }}
          </div>
          <div class="knowledge__body">
            <span v-if="sec.content" class="knowledge__text">{{ sec.content }}</span>
            <span v-else class="knowledge__empty">暂未维护</span>
          </div>
        </div>

        <!-- 制度文件 -->
        <div class="pims-card" style="margin-top: 16px">
          <div class="pims-card__title">
            相关制度文件（在线学习参考）
            <el-button v-permission="['系统管理员']" class="pims-card__extra" size="small" :icon="Upload" @click="ElMessage('制度文件由系统管理员统一上传（演示）')">
              上传文件
            </el-button>
          </div>
          <el-table :data="knowledgeStore.policyFiles" style="width: 100%">
            <el-table-column label="文件名称" min-width="280">
              <template #default="{ row }">
                <span style="display: inline-flex; align-items: center; gap: 6px">
                  <el-icon color="var(--pims-primary)"><Document /></el-icon>{{ row.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="分类" width="110">
              <template #default="{ row }"><el-tag size="small">{{ row.cat }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="size" label="大小" width="90" />
            <el-table-column prop="date" label="上传时间" width="110" />
            <el-table-column label="操作" width="140">
              <template #default="{ row }">
                <el-button text type="primary" size="small" :icon="View" @click="ElMessage('在线预览（演示）')">预览</el-button>
                <el-button text type="primary" size="small" :icon="Download" @click="ElMessage.success(`开始下载：${row.name}（演示）`)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </DetailLayout>
  </div>
</template>

<style scoped lang="scss">
.knowledge {
  &__filter {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    margin-bottom: var(--pims-space-4);
    padding: var(--pims-space-3) var(--pims-space-4);
  }

  &__filter-label {
    font-size: 14px;
    color: var(--pims-text-secondary);
    white-space: nowrap;
  }

  &__section {
    background: #fff;
    border: 1px solid var(--pims-border);
    border-radius: var(--pims-radius-lg);
    margin-bottom: var(--pims-space-3);
    overflow: hidden;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    padding: 11px var(--pims-space-3);
    background: var(--pims-surface-muted);
    font-size: 13px;
    font-weight: 600;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  &__body {
    padding: var(--pims-space-3);
  }

  &__text {
    font-size: 13px;
    line-height: 1.9;
    color: var(--pims-text-secondary);
    white-space: pre-wrap;
  }

  &__empty {
    font-size: 13px;
    color: var(--pims-text-tertiary);
    font-style: italic;
  }
}
</style>

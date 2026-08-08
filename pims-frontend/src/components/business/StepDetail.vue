<script setup lang="ts">
/**
 * 关键环节详情面板（规范 4.3 StepDetail）
 * 展示工作要求、制度依据、注意事项、潜在风险、实施情况、关联问题/经验
 * 数据通过 Props 传入，事件通过 Emit 传出（规范 6.4 模块边界约束）
 */
import { computed, ref } from 'vue'
import { Picture, Paperclip, Plus, WarningFilled, Star, EditPen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Stage, ImplRecord } from '@/types/project'
import type { Issue } from '@/types/issue'
import type { Experience } from '@/types/exp'

interface Props {
  /** 当前阶段 */
  stage: Stage
  /** 当前环节索引 */
  stepIndex: number
  /** 实施情况记录 */
  implRecords?: ImplRecord[]
  /** 本环节已公开问题 */
  issues?: Issue[]
  /** 本环节已公开经验 */
  exps?: Experience[]
  /** 是否可录入（项目实施单位） */
  canEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  implRecords: () => [], issues: () => [], exps: () => [], canEdit: false
})

const emit = defineEmits<{
  'save-impl': [text: string]
  'submit-issue': []
  'submit-exp': []
}>()

const step = computed(() => props.stage.steps[props.stepIndex])

const SECTIONS = computed(() => [
  { key: 'req', title: '工作要求', content: step.value.req, color: 'var(--pims-primary)' },
  { key: 'law', title: '法律政策制度依据', content: step.value.law, color: '#8b5cf6' },
  { key: 'notice', title: '注意事项', content: step.value.notice, color: 'var(--pims-warning)' },
  { key: 'risk', title: '潜在风险', content: step.value.risk, color: 'var(--pims-danger)' }
])

const implText = ref('')

function saveImpl(): void {
  if (!implText.value.trim()) {
    ElMessage.warning('请输入实施情况内容')
    return
  }
  emit('save-impl', implText.value.trim())
  implText.value = ''
}
</script>

<template>
  <div class="step-detail">
    <!-- 知识库内容区块 -->
    <div v-for="sec in SECTIONS" :key="sec.key" class="step-detail__section">
      <div class="step-detail__head">
        <span class="step-detail__dot" :style="{ background: sec.color }" />{{ sec.title }}
      </div>
      <div class="step-detail__body">
        <span v-if="sec.content" class="step-detail__text">{{ sec.content }}</span>
        <span v-else class="step-detail__empty">知识库暂未维护该内容</span>
      </div>
    </div>

    <!-- 实施情况 -->
    <div class="step-detail__section">
      <div class="step-detail__head">
        <span class="step-detail__dot" style="background: var(--pims-success)" />实施情况（实时录入）
        <span class="step-detail__head-hint">非强制 · 支持富文本、图片、附件</span>
      </div>
      <div class="step-detail__body">
        <div v-for="record in implRecords" :key="record.id" class="step-detail__impl">
          <div class="step-detail__impl-meta">
            <b style="color: var(--pims-success)">{{ record.user }}</b>
            <span class="text-tertiary">{{ record.date }}</span>
            <span v-if="record.images" class="text-tertiary"><el-icon><Picture /></el-icon> × {{ record.images }}</span>
            <span v-if="record.files" class="text-tertiary"><el-icon><Paperclip /></el-icon> × {{ record.files }}</span>
          </div>
          <div class="step-detail__text">{{ record.text }}</div>
        </div>
        <template v-if="canEdit">
          <el-input
            v-model="implText"
            type="textarea"
            :rows="3"
            placeholder="录入本环节实际执行情况，如完成时间、办理结果、留存资料说明等…"
          />
          <div class="step-detail__impl-actions">
            <el-button size="small" :icon="Picture" @click="ElMessage('已添加图片（演示）')">图片</el-button>
            <el-button size="small" :icon="Paperclip" @click="ElMessage('已添加附件（演示）')">附件</el-button>
            <div style="flex: 1" />
            <el-button size="small" type="primary" :icon="Plus" @click="saveImpl">保存实施记录</el-button>
          </div>
        </template>
      </div>
    </div>

    <!-- 关联问题 -->
    <div class="step-detail__section">
      <div class="step-detail__head">
        <span class="step-detail__dot" style="background: var(--pims-warning)" />问题库（本环节已公开问题）
        <el-button v-if="canEdit" class="step-detail__head-btn" size="small" text type="warning" :icon="WarningFilled" @click="emit('submit-issue')">
          提交问题
        </el-button>
      </div>
      <div class="step-detail__body">
        <div v-for="issue in issues" :key="issue.id" class="step-detail__issue">
          <div class="step-detail__text">{{ issue.desc }}</div>
          <div class="text-tertiary" style="margin-top: 6px">关联项目：{{ issue.project }} · {{ issue.date }}</div>
        </div>
        <span v-if="!issues.length" class="step-detail__empty">本环节暂无公开问题记录</span>
      </div>
    </div>

    <!-- 关联经验 -->
    <div class="step-detail__section">
      <div class="step-detail__head">
        <span class="step-detail__dot" style="background: #13c2c2" />经验共享（本环节已公开经验）
        <el-button v-if="canEdit" class="step-detail__head-btn" size="small" text style="color: #13c2c2" :icon="Star" @click="emit('submit-exp')">
          提交经验
        </el-button>
      </div>
      <div class="step-detail__body">
        <div v-for="exp in exps" :key="exp.id" class="step-detail__exp">
          <div class="step-detail__exp-title"><el-icon><Star /></el-icon> {{ exp.title }}</div>
          <div class="step-detail__text" style="margin-top: 4px">{{ exp.desc }}</div>
          <div class="text-tertiary" style="margin-top: 6px">关联项目：{{ exp.project }} · {{ exp.date }}</div>
        </div>
        <span v-if="!exps.length" class="step-detail__empty">本环节暂无公开经验记录</span>
      </div>
    </div>

    <div v-if="!canEdit" class="step-detail__readonly">
      <el-icon><EditPen /></el-icon> 当前角色为只读访问，录入功能仅面向项目实施单位开放
    </div>
  </div>
</template>

<style scoped lang="scss">
.step-detail {
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
    color: var(--pims-text-primary);
  }

  &__head-hint {
    margin-left: auto;
    font-size: 12px;
    font-weight: 400;
    color: var(--pims-text-tertiary);
  }

  &__head-btn {
    margin-left: auto;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex: none;
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

  &__impl {
    background: #f7fbf9;
    border: 1px solid #d8efe4;
    border-radius: var(--pims-radius-md);
    padding: 10px var(--pims-space-3);
    margin-bottom: var(--pims-space-2);
  }

  &__impl-meta {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    margin-bottom: var(--pims-space-1);
    font-size: 12px;

    .el-icon {
      vertical-align: -2px;
    }
  }

  &__impl-actions {
    display: flex;
    gap: var(--pims-space-2);
    margin-top: var(--pims-space-2);
  }

  &__issue {
    background: #fffdf5;
    border: 1px solid #fdead2;
    border-radius: var(--pims-radius-md);
    padding: 10px var(--pims-space-3);
    margin-bottom: var(--pims-space-2);
  }

  &__exp {
    background: #f5fffc;
    border: 1px solid #c9f0e4;
    border-radius: var(--pims-radius-md);
    padding: 10px var(--pims-space-3);
    margin-bottom: var(--pims-space-2);
  }

  &__exp-title {
    display: flex;
    align-items: center;
    gap: var(--pims-space-1);
    font-size: 13px;
    font-weight: 600;
    color: #0d9488;
  }

  &__readonly {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    justify-content: center;
    font-size: 12px;
    color: var(--pims-text-tertiary);
    padding: var(--pims-space-3);
  }
}
</style>

<script setup lang="ts">
/**
 * 项目详情 · 全生命周期跟踪（PRD 5.2.3）
 * 阶段时间轴 + 环节详情（工作要求/制度依据/注意事项/风险/实施情况/问题/经验）
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, WarningFilled, Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import DetailLayout from '@/components/layout/DetailLayout.vue'
import StatusBadge from '@/components/business/StatusBadge.vue'
import StageTimeline from '@/components/business/StageTimeline.vue'
import KnowledgeTree from '@/components/business/KnowledgeTree.vue'
import StepDetail from '@/components/business/StepDetail.vue'
import { useProjectStore, useKnowledgeStore, useUserStore } from '@/stores'
import { getIssueList, createIssue } from '@/api/issue'
import { getExpList, createExp } from '@/api/exp'
import { saveImplRecord } from '@/api/project'
import { usePermission } from '@/composables/usePermission'
import { formatAmount } from '@/utils/format'
import { required } from '@/utils/validate'
import type { ImplRecord } from '@/types/project'
import type { Issue } from '@/types/issue'
import type { Experience } from '@/types/exp'
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const projectStore = useProjectStore()
const knowledgeStore = useKnowledgeStore()
const userStore = useUserStore()
const { canEditProject } = usePermission()

const activeStageId = ref(1)
const activeStepIndex = ref(0)
const allIssues = ref<Issue[]>([])
const allExps = ref<Experience[]>([])
const implRecords = ref<ImplRecord[]>([
  { id: 1, user: '王建国', date: '2026-07-15', text: '已完成本月进度款支付审批，累计支付比例 62%，未超 80% 红线；施工日志与影像资料同步归档。', images: 2, files: 1 }
])

const project = computed(() => projectStore.currentProject)
const activeStage = computed(() => knowledgeStore.stages.find((s) => s.id === activeStageId.value) ?? knowledgeStore.stages[0])

/** 本环节已公开问题 / 经验 */
const stepIssues = computed(() =>
  allIssues.value.filter((i) => i.stageId === activeStageId.value && i.step === activeStage.value?.steps[activeStepIndex.value]?.name)
)
const stepExps = computed(() =>
  allExps.value.filter((e) => e.stageId === activeStageId.value && e.step === activeStage.value?.steps[activeStepIndex.value]?.name)
)

const progress = computed(() => (project.value ? Math.round((project.value.stageId / 12) * 100) : 0))

function handleSelect(stageId: number, stepIndex: number): void {
  activeStageId.value = stageId
  activeStepIndex.value = stepIndex
}

/* ---------- 实施情况 ---------- */
async function handleSaveImpl(text: string): Promise<void> {
  await saveImplRecord(project.value?.id ?? 0, activeStage.value?.steps[activeStepIndex.value]?.name ?? '', text)
  implRecords.value.unshift({
    id: Date.now(),
    user: userStore.userInfo?.name ?? '当前用户',
    date: '2026-08-02',
    text,
    images: 0,
    files: 0
  })
  ElMessage.success('实施记录已保存')
}

/* ---------- 提交问题 / 经验 ---------- */
const submitDialogVisible = ref(false)
const submitType = ref<'问题' | '经验'>('问题')
const submitFormRef = ref<FormInstance>()
const submitForm = ref({ title: '', desc: '' })
const submitRules: FormRules = {
  title: [required('请输入经验标题')],
  desc: [required('请输入描述内容')]
}

const currentStepName = computed(() => activeStage.value?.steps[activeStepIndex.value]?.name ?? '')

function openSubmit(type: '问题' | '经验'): void {
  submitType.value = type
  submitForm.value = { title: '', desc: '' }
  submitDialogVisible.value = true
}

async function handleSubmit(): Promise<void> {
  const valid = await submitFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const payload = { project: project.value?.name ?? '', step: currentStepName.value }
  if (submitType.value === '问题') {
    await createIssue({ ...payload, desc: submitForm.value.desc })
  } else {
    await createExp({ ...payload, title: submitForm.value.title, desc: submitForm.value.desc })
  }
  submitDialogVisible.value = false
  ElMessage.success(`${submitType.value}已提交，待内容审核员审核`)
}

onMounted(async () => {
  const id = Number(route.params.id) || 1
  await Promise.all([
    projectStore.fetchDetail(id),
    knowledgeStore.fetchStages(),
    getIssueList({ keyword: '', stageId: '', step: '' }).then((r) => (allIssues.value = r)),
    getExpList({ keyword: '', stageId: '', step: '' }).then((r) => (allExps.value = r))
  ])
  activeStageId.value = project.value?.stageId ?? 1
})
</script>

<template>
  <div class="page-container" v-loading="projectStore.loading">
    <template v-if="project">
      <PageHeader :title="project.name" description="项目全生命周期跟踪">
        <template #actions>
          <StatusBadge :status="project.status" />
          <el-button :icon="Download" @click="ElMessage.success('已生成项目全周期报告（演示）')">导出项目报告</el-button>
        </template>
      </PageHeader>

      <!-- 项目概要 -->
      <div class="pims-card">
        <el-descriptions :column="4" border size="default">
          <el-descriptions-item label="项目类型">{{ project.type }}</el-descriptions-item>
          <el-descriptions-item label="实施单位">{{ project.org }}</el-descriptions-item>
          <el-descriptions-item label="投资金额">
            <span class="num" style="color: var(--pims-primary); font-weight: 600">{{ formatAmount(project.amount) }} 万元</span>
          </el-descriptions-item>
          <el-descriptions-item label="立项时间"><span class="num">{{ project.date }}</span></el-descriptions-item>
          <el-descriptions-item label="项目负责人">{{ project.manager }}</el-descriptions-item>
          <el-descriptions-item label="当前阶段">第 {{ project.stageId }} 阶段 · {{ project.stage }}</el-descriptions-item>
          <el-descriptions-item label="全周期进度" :span="2">
            <el-progress :percentage="progress" :stroke-width="10" style="width: 220px" />
          </el-descriptions-item>
        </el-descriptions>

        <el-divider style="margin: 16px 0 4px" />
        <StageTimeline v-model="activeStageId" :stages="knowledgeStore.stages" :current="project.stageId" @stage-click="(id: number) => (activeStepIndex = 0)" />
      </div>

      <!-- 环节详情 -->
      <DetailLayout v-if="activeStage">
        <template #aside>
          <KnowledgeTree
            :stages="knowledgeStore.stages"
            :active-stage-id="activeStageId"
            :active-step-index="activeStepIndex"
            :current-stage-id="project.stageId"
            @select="handleSelect"
          />
        </template>

        <div class="pims-card" style="margin-bottom: 12px">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div>
              <div class="text-tertiary">第 {{ activeStage.id }} 阶段 · {{ activeStage.name }}</div>
              <div style="font-size: 16px; font-weight: 600; margin-top: 2px">{{ activeStage.steps[activeStepIndex]?.name }}</div>
            </div>
            <div v-if="canEditProject" style="display: flex; gap: 8px">
              <el-button size="small" type="warning" plain :icon="WarningFilled" @click="openSubmit('问题')">提交问题</el-button>
              <el-button size="small" type="success" plain :icon="Star" @click="openSubmit('经验')">提交经验</el-button>
            </div>
          </div>
        </div>

        <StepDetail
          :stage="activeStage"
          :step-index="activeStepIndex"
          :impl-records="implRecords"
          :issues="stepIssues"
          :exps="stepExps"
          :can-edit="canEditProject"
          @save-impl="handleSaveImpl"
          @submit-issue="openSubmit('问题')"
          @submit-exp="openSubmit('经验')"
        />
      </DetailLayout>
    </template>

    <!-- 提交问题/经验弹窗 -->
    <el-dialog v-model="submitDialogVisible" :title="`提交${submitType}`" width="600px" destroy-on-close>
      <el-alert type="warning" :closable="false" style="margin-bottom: 16px">
        提交后进入<b>待审核</b>状态，经内容审核员审核通过后将在{{ submitType }}库公开展示。请勿录入涉密或敏感信息。
      </el-alert>
      <el-form ref="submitFormRef" :model="submitForm" :rules="submitRules" label-width="90px">
        <el-form-item label="所属环节">
          <el-input :model-value="`${activeStage?.name} / ${currentStepName}（项目：${project?.name}）`" readonly />
        </el-form-item>
        <el-form-item v-if="submitType === '经验'" label="经验标题" prop="title" required>
          <el-input v-model="submitForm.title" placeholder="请输入经验标题" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item :label="`${submitType}描述`" prop="desc" required>
          <el-input
            v-model="submitForm.desc"
            type="textarea"
            :rows="5"
            maxlength="500"
            show-word-limit
            placeholder="请客观描述事实经过、造成的影响及后续处理情况"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="submitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">提交审核</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 系统配置（PRD 5.8 · 系统管理 - 项目类别/阶段配置/字段配置/内容审核/制度文件）
 */
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type TabsPaneContext } from 'element-plus'
import { Plus, Upload, Download, Refresh } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import EmptyState from '@/components/layout/EmptyState.vue'
import StatusBadge from '@/components/business/StatusBadge.vue'
import { getPendingReviews, reviewContent } from '@/api/system'
import { useKnowledgeStore } from '@/stores'
import type { PendingReview, PolicyFile } from '@/types/system'
import type { Stage } from '@/types/project'

const knowledgeStore = useKnowledgeStore()
const activeTab = ref<'cat' | 'stage' | 'field' | 'review' | 'file'>('cat')

/** 项目类别管理（静态演示数据） */
interface ProjectCategory {
  name: string
  template: string
  stageCount: number
  projectCount: number
  status: '启用' | '停用'
}

const CATEGORIES: ProjectCategory[] = [
  {
    name: '固定资产投资项目',
    template: '工程建设项目全生命周期管理流程',
    stageCount: 12,
    projectCount: 8,
    status: '启用'
  },
  {
    name: '信息化投资项目',
    template: '信息化项目全生命周期管理流程',
    stageCount: 9,
    projectCount: 4,
    status: '启用'
  }
]

/** 阶段/节点/事项配置 */
const stageConfigType = ref('固定资产投资项目')
const stageConfigLoading = ref(false)

const filteredStages = computed<Stage[]>(() => {
  return stageConfigType.value === '信息化投资项目'
    ? knowledgeStore.stages.slice(0, 9)
    : knowledgeStore.stages
})

async function loadStageConfig(): Promise<void> {
  if (knowledgeStore.stages.length) return
  stageConfigLoading.value = true
  try {
    await knowledgeStore.fetchStages()
  } finally {
    stageConfigLoading.value = false
  }
}

/** 阶段完成天数编辑 */
const durationDialogVisible = ref(false)
const durationFormRef = ref<FormInstance>()
const durationForm = reactive<{ id: number; name: string; duration: number | null }>({
  id: 0,
  name: '',
  duration: null
})
const durationRules = {
  duration: [
    { required: true, message: '请输入完成天数', trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: '天数应在 1-365 之间', trigger: 'blur' }
  ]
}

function openDurationDialog(stage: Stage): void {
  durationForm.id = stage.id
  durationForm.name = stage.name
  durationForm.duration = stage.duration ?? null
  durationDialogVisible.value = true
}

async function saveDuration(): Promise<void> {
  if (!durationFormRef.value) return
  await durationFormRef.value.validate(async (valid) => {
    if (!valid) return
    const target = knowledgeStore.stages.find((s) => s.id === durationForm.id)
    if (target) {
      target.duration = durationForm.duration as number
    }
    ElMessage.success(`「${durationForm.name}」完成天数已更新为 ${durationForm.duration} 天（演示）`)
    durationDialogVisible.value = false
  })
}

/** 字段配置（静态） */
const FIELD_CONFIG = [
  { name: '工作要求', desc: '关键节点、必要事项的详细说明和规范要求', source: '知识库维护', required: true, show: true },
  { name: '法律政策制度依据', desc: '相关法律法规、行业制度条文', source: '知识库维护', required: true, show: true },
  { name: '注意事项', desc: '实施过程中的注意要点', source: '知识库维护', required: false, show: true },
  { name: '潜在风险', desc: '该环节可能出现的风险点', source: '知识库维护', required: false, show: true },
  { name: '实施情况', desc: '实施单位实时录入的实际执行情况', source: '项目实施单位录入', required: false, show: false },
  { name: '问题库', desc: '该环节已审核通过的问题记录', source: '单位录入 + 审核', required: false, show: true },
  { name: '经验共享', desc: '该环节已审核通过的经验记录', source: '单位录入 + 审核', required: false, show: true }
]

/** 待审核内容 */
const reviewList = ref<PendingReview[]>([])
const reviewLoading = ref(false)
const reviewStatus = ref<'待审核' | '已通过' | '已驳回'>('待审核')

async function loadReviews(): Promise<void> {
  reviewLoading.value = true
  try {
    reviewList.value = await getPendingReviews(reviewStatus.value)
  } finally {
    reviewLoading.value = false
  }
}

async function handleReview(item: PendingReview, action: 'pass' | 'reject'): Promise<void> {
  const verb = action === 'pass' ? '通过' : '驳回'
  await ElMessageBox.confirm(`确定${verb}「${item.title}」吗？`, '审核确认', { type: action === 'pass' ? 'success' : 'warning' })
  await reviewContent(item.id, action)
  ElMessage.success(`已${verb}${action === 'pass' ? '并公开' : '并通知提交人'}（演示）`)
  reviewList.value = reviewList.value.filter((r) => r.id !== item.id)
}

/** 制度文件 */
const fileList = ref<PolicyFile[]>([])
const fileLoading = ref(false)

async function loadFiles(): Promise<void> {
  fileLoading.value = true
  try {
    await knowledgeStore.fetchPolicyFiles()
    fileList.value = knowledgeStore.policyFiles
  } finally {
    fileLoading.value = false
  }
}

function handleTab(tab: TabsPaneContext): void {
  const name = tab.paneName as typeof activeTab.value
  if (name === 'stage') loadStageConfig()
  if (name === 'review' && !reviewList.value.length) loadReviews()
  if (name === 'file' && !fileList.value.length) loadFiles()
}

function uploadFile(): void {
  ElMessage.info('文件上传功能（演示）')
}

function downloadFile(file: PolicyFile): void {
  ElMessage.success(`下载「${file.name}」（演示）`)
}

async function deleteFile(file: PolicyFile): Promise<void> {
  await ElMessageBox.confirm(`确定删除「${file.name}」吗？删除后不可恢复`, '删除确认', { type: 'warning' })
  fileList.value = fileList.value.filter((f) => f.id !== file.id)
  ElMessage.success('文件已删除（演示）')
}
</script>

<template>
  <div class="page-container">
    <PageHeader title="系统配置" description="项目类别管理 · 阶段/节点/事项配置 · 字段配置管理 · 内容审核管理 · 制度文件管理" />

    <div class="pims-card">
      <el-tabs v-model="activeTab" @tab-change="handleTab">
        <!-- 项目类别管理 -->
        <el-tab-pane label="项目类别管理" name="cat">
          <div class="config__bar">
            <span class="text-tertiary">支持投资项目类别的修改、增减；创建项目时按类别自动关联全生命周期流程模板。</span>
            <el-button v-permission="['系统管理员']" type="primary" size="small" :icon="Plus" @click="ElMessage.info('新增类别（演示）')">新增类别</el-button>
          </div>
          <el-table :data="CATEGORIES" border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="类别名称" width="180" />
            <el-table-column prop="template" label="流程模板" min-width="280" />
            <el-table-column prop="stageCount" label="阶段数" width="80" align="center" />
            <el-table-column prop="projectCount" label="项目数" width="80" align="center" />
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }"><StatusBadge :status="row.status" size="small" /></template>
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template #default>
                <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="ElMessage.info('编辑类别（演示）')">编辑</el-button>
                <el-button v-permission="['系统管理员']" text type="danger" size="small" @click="ElMessage.info('停用前需确认无在办项目（演示）')">停用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 阶段/节点/事项配置 -->
        <el-tab-pane label="阶段/节点/事项配置" name="stage">
          <div class="config__bar">
            <span class="text-tertiary">对项目类型的阶段、节点、事项进行修改、增减，支持调整阶段顺序。</span>
            <div style="display: flex; gap: 8px">
              <el-select v-model="stageConfigType" size="small" style="width: 200px">
                <el-option label="固定资产投资项目" value="固定资产投资项目" />
                <el-option label="信息化投资项目" value="信息化投资项目" />
              </el-select>
              <el-button v-permission="['系统管理员']" type="primary" size="small" :icon="Plus" @click="ElMessage.info('新增阶段（演示）')">新增阶段</el-button>
            </div>
          </div>
          <el-table v-loading="stageConfigLoading" :data="filteredStages" border style="width: 100%">
            <el-table-column type="index" label="顺序" width="60" align="center" />
            <el-table-column label="项目阶段" width="180">
              <template #default="{ row }"><b>{{ row.name }}</b></template>
            </el-table-column>
            <el-table-column label="关键环节 / 实施步骤" min-width="360">
              <template #default="{ row }">
                <el-tag
                  v-for="step in row.steps"
                  :key="step.name"
                  size="small"
                  effect="plain"
                  type="info"
                  style="margin: 2px 6px 2px 0"
                >{{ step.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="steps.length" label="环节数" width="80" align="center" />
            <el-table-column label="完成天数" width="110" align="center">
              <template #default="{ row }">
                <span v-if="row.duration" class="stage-duration">{{ row.duration }} 天</span>
                <span v-else class="text-tertiary">未设置</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" fixed="right">
              <template #default="{ row }">
                <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="openDurationDialog(row)">设置天数</el-button>
                <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="ElMessage.info('编辑阶段（演示）')">编辑</el-button>
                <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="ElMessage.info('上移（演示）')">↑</el-button>
                <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="ElMessage.info('下移（演示）')">↓</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 字段配置 -->
        <el-tab-pane label="字段配置管理" name="field">
          <div class="config__bar">
            <span class="text-tertiary">对环节内容字段进行修改、增减，支持自定义扩展字段。</span>
            <el-button v-permission="['系统管理员']" type="primary" size="small" :icon="Plus" @click="ElMessage.info('新增自定义字段（演示）')">新增字段</el-button>
          </div>
          <el-table :data="FIELD_CONFIG" border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="字段名称" width="150" />
            <el-table-column prop="desc" label="说明" min-width="240" show-overflow-tooltip />
            <el-table-column prop="source" label="来源" width="170" />
            <el-table-column label="是否必填" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="row.required ? 'danger' : 'info'" effect="plain">{{ row.required ? '必填' : '选填' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="前台展示" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="row.show ? 'success' : 'info'" effect="plain">{{ row.show ? '展示' : '不公开' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default>
                <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="ElMessage.info('编辑字段（演示）')">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 内容审核 -->
        <el-tab-pane name="review">
          <template #label>
            内容审核管理
            <el-badge v-if="reviewList.length" :value="reviewList.length" type="danger" style="margin-left: 4px" />
          </template>
          <div class="config__bar">
            <span class="text-tertiary">问题库、经验库内容须经审核通过后才可在前台展示；支持审核通过 / 驳回与审核记录查询。</span>
            <el-select v-model="reviewStatus" size="small" style="width: 140px" @change="loadReviews">
              <el-option label="待审核" value="待审核" />
              <el-option label="已通过" value="已通过" />
              <el-option label="已驳回" value="已驳回" />
            </el-select>
          </div>
          <el-table v-loading="reviewLoading" :data="reviewList" border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="类型" width="80" align="center">
              <template #default="{ row }"><StatusBadge :status="row.type" size="small" /></template>
            </el-table-column>
            <el-table-column prop="title" label="内容摘要" min-width="280" show-overflow-tooltip />
            <el-table-column prop="project" label="关联项目" width="180" show-overflow-tooltip />
            <el-table-column prop="step" label="所属环节" width="130" />
            <el-table-column prop="submitter" label="提交人" width="90" />
            <el-table-column prop="date" label="提交时间" width="110" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button v-permission="['内容审核员', '系统管理员']" text type="success" size="small" @click="handleReview(row, 'pass')">通过</el-button>
                <el-button v-permission="['内容审核员', '系统管理员']" text type="danger" size="small" @click="handleReview(row, 'reject')">驳回</el-button>
              </template>
            </el-table-column>
            <template #empty>
              <EmptyState text="暂无待审核内容" />
            </template>
          </el-table>
        </el-tab-pane>

        <!-- 制度文件 -->
        <el-tab-pane label="制度文件管理" name="file">
          <div class="config__bar">
            <span class="text-tertiary">上传、更新、删除相关制度文件，支持文件分类管理，供全员学习参考。</span>
            <el-button v-permission="['系统管理员', '内容审核员']" type="primary" size="small" :icon="Upload" @click="uploadFile">上传文件</el-button>
          </div>
          <el-table v-loading="fileLoading" :data="fileList" border style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="文件名称" min-width="280" show-overflow-tooltip />
            <el-table-column label="分类" width="120">
              <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.cat }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="size" label="大小" width="90" />
            <el-table-column prop="uploader" label="上传人" width="110" />
            <el-table-column prop="date" label="上传时间" width="120" />
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" :icon="Download" @click="downloadFile(row)">下载</el-button>
                <el-button v-permission="['系统管理员', '内容审核员']" text type="primary" size="small" :icon="Refresh">更新</el-button>
                <el-button v-permission="['系统管理员']" text type="danger" size="small" @click="deleteFile(row)">删除</el-button>
              </template>
            </el-table-column>
            <template #empty>
              <EmptyState text="暂无制度文件" />
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 阶段完成天数编辑弹窗 -->
    <el-dialog
      v-model="durationDialogVisible"
      title="设置阶段完成天数"
      width="420px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="durationFormRef"
        :model="durationForm"
        :rules="durationRules"
        label-width="100px"
      >
        <el-form-item label="阶段名称">
          <span style="font-weight: 600">{{ durationForm.name }}</span>
        </el-form-item>
        <el-form-item label="完成天数" prop="duration">
          <el-input-number
            v-model="durationForm.duration"
            :min="1"
            :max="365"
            controls-position="right"
            style="width: 200px"
            placeholder="请输入"
          />
          <span style="margin-left: 8px; color: var(--pims-text-tertiary)">天</span>
        </el-form-item>
        <el-form-item>
          <span class="text-tertiary" style="font-size: 12px">
            用于项目阶段计划周期管理，系统将按此天数对项目阶段进度进行预警提示。
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="durationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDuration">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.config {
  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--pims-space-3);
    margin-bottom: var(--pims-space-4);
  }
}

.stage-duration {
  font-weight: 600;
  color: var(--pims-primary);
}
</style>

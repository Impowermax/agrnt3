<script setup lang="ts">
/**
 * 新增项目（PRD 5.2.2）
 * 两类项目选择 + 基础信息表单，创建后自动关联全生命周期流程模板
 */
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, Monitor } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import PageHeader from '@/components/layout/PageHeader.vue'
import { createProject } from '@/api/project'
import { required, requiredSelect, amountRule, mobileRule, maxLength } from '@/utils/validate'
import type { ProjectCreateForm, ProjectType } from '@/types/project'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive<ProjectCreateForm>({
  name: '',
  type: '固定资产投资项目',
  org: '市公司项目管理办公室',
  amount: null,
  date: '2026-08-02',
  manager: '',
  phone: '',
  description: ''
})

const rules: FormRules = {
  name: [required('请输入项目名称'), maxLength(60)],
  type: [requiredSelect('请选择项目类型')],
  org: [requiredSelect('请选择实施单位')],
  amount: [required('请输入计划投资金额'), amountRule],
  date: [requiredSelect('请选择拟立项时间')],
  manager: [required('请输入项目负责人')],
  phone: [mobileRule]
}

const TYPE_OPTIONS: { value: ProjectType; title: string; desc: string; icon: typeof OfficeBuilding }[] = [
  {
    value: '固定资产投资项目', title: '固定资产投资项目', icon: OfficeBuilding,
    desc: '工程建设项目全生命周期管理，覆盖投资计划与立项、土地房产购置、初设概算、招标合同、施工、验收、结算决算、后评价等 12 个阶段。'
  },
  {
    value: '信息化投资项目', title: '信息化投资项目', icon: Monitor,
    desc: '信息系统建设类项目，覆盖立项、需求、设计开发、测试、上线、验收、运维评价等阶段（流程模板可在系统管理中配置扩展）。'
  }
]

async function handleSubmit(): Promise<void> {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createProject(form)
    ElMessage.success(`项目创建成功，已关联「${form.type}」流程模板`)
    router.push('/project')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <PageHeader title="新增项目" description="项目创建成功后，系统将自动关联所选项目类型对应的全生命周期管理流程模板">
      <template #actions>
        <el-button @click="router.push('/project')">返回列表</el-button>
      </template>
    </PageHeader>

    <div class="pims-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px" label-position="right" style="max-width: 880px">
        <el-form-item label="项目类型" prop="type" required>
          <div class="create__types">
            <div
              v-for="opt in TYPE_OPTIONS"
              :key="opt.value"
              class="create__type-card"
              :class="{ 'create__type-card--selected': form.type === opt.value }"
              @click="form.type = opt.value"
            >
              <div class="create__type-title">
                <el-icon color="var(--pims-primary)"><component :is="opt.icon" /></el-icon>{{ opt.title }}
              </div>
              <p class="create__type-desc">{{ opt.desc }}</p>
            </div>
          </div>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name" required>
              <el-input v-model="form.name" placeholder="请输入项目全称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施单位" prop="org" required>
              <el-select v-model="form.org" placeholder="请选择实施单位" style="width: 100%">
                <el-option label="市公司项目管理办公室" value="市公司项目管理办公室" />
                <el-option label="城区分公司" value="城区分公司" />
                <el-option label="县公司" value="县公司" />
                <el-option label="物流中心" value="物流中心" />
                <el-option label="信息中心" value="信息中心" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划投资金额" prop="amount" required>
              <el-input v-model="form.amount" type="number" placeholder="如：3200">
                <template #suffix>万元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拟立项时间" prop="date" required>
              <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="manager" required>
              <el-input v-model="form.manager" placeholder="请输入负责人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="项目概况" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请简要描述项目建设背景、主要建设内容与目标"
          />
          <template #extra>
            <span class="text-tertiary" style="font-size: 12px">请勿录入涉密或敏感信息，系统对敏感内容实行审核管控。</span>
          </template>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">创建项目</el-button>
          <el-button @click="router.push('/project')">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create {
  &__types {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--pims-space-3);
    width: 100%;
  }

  &__type-card {
    border: 1.5px solid var(--pims-border);
    border-radius: var(--pims-radius-lg);
    padding: var(--pims-space-4);
    cursor: pointer;
    transition: border-color 150ms ease-out, background 150ms ease-out;

    &:hover {
      border-color: var(--pims-primary);
    }

    &--selected {
      border-color: var(--pims-primary);
      background: var(--pims-primary-light);
    }
  }

  &__type-title {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    font-size: 14px;
    font-weight: 600;
    margin-bottom: var(--pims-space-1);
  }

  &__type-desc {
    font-size: 12px;
    color: var(--pims-text-tertiary);
    line-height: 1.7;
  }
}
</style>

<script setup lang="ts">
/**
 * 用户管理（PRD 5.8 · 系统管理 - 用户与权限管理）
 * 用户账号增删改查 + 状态启停 + 重置密码
 */
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SearchFilter from '@/components/business/SearchFilter.vue'
import StatusBadge from '@/components/business/StatusBadge.vue'
import EmptyState from '@/components/layout/EmptyState.vue'
import { getUserList } from '@/api/system'
import { useSearch } from '@/composables/useSearch'
import type { SystemUser } from '@/types/system'
import type { UserRole } from '@/types/common'
import type { FilterConfig } from '@/types/common'

const ROLE_OPTIONS: { label: UserRole; value: UserRole }[] = [
  { label: '系统管理员', value: '系统管理员' },
  { label: '内容审核员', value: '内容审核员' },
  { label: '项目实施单位', value: '项目实施单位' },
  { label: '审批单位人员', value: '审批单位人员' },
  { label: '管理层', value: '管理层' }
]

const userList = ref<SystemUser[]>([])
const loading = ref(false)

const { query, search, reset } = useSearch({
  defaultQuery: { keyword: '', role: '' },
  onSearch: () => loadUsers()
})

const filters = computed<FilterConfig[]>(() => [
  { key: 'keyword', label: '姓名/账号', type: 'input', placeholder: '请输入姓名或账号' },
  { key: 'role', label: '角色', type: 'select', options: ROLE_OPTIONS }
])

const filteredList = computed(() =>
  userList.value.filter((u) => {
    const kw = query.value.keyword as string
    const role = query.value.role as string
    return (
      (!kw || u.name.includes(kw) || u.account.includes(kw)) &&
      (!role || u.role === role)
    )
  })
)

async function loadUsers(): Promise<void> {
  loading.value = true
  try {
    userList.value = await getUserList()
  } finally {
    loading.value = false
  }
}

/* 新增/编辑弹窗 */
const dialogVisible = ref(false)
const editingUser = ref<SystemUser | null>(null)
const form = ref({ name: '', account: '', role: '项目实施单位' as UserRole, org: '', status: '启用' as '启用' | '停用' })

function openCreate(): void {
  editingUser.value = null
  form.value = { name: '', account: '', role: '项目实施单位', org: '', status: '启用' }
  dialogVisible.value = true
}

function openEdit(user: SystemUser): void {
  editingUser.value = user
  form.value = { name: user.name, account: user.account, role: user.role, org: user.org, status: user.status }
  dialogVisible.value = true
}

function saveUser(): void {
  if (!form.value.name || !form.value.account) {
    ElMessage.warning('请填写姓名与账号')
    return
  }
  ElMessage.success(editingUser.value ? '用户信息已更新（演示）' : '用户新增成功（演示）')
  dialogVisible.value = false
}

async function toggleStatus(user: SystemUser): Promise<void> {
  await ElMessageBox.confirm(`确定${user.status === '启用' ? '停用' : '启用'}账号「${user.name}」吗？`, '提示', { type: 'warning' })
  user.status = user.status === '启用' ? '停用' : '启用'
  ElMessage.success('状态已更新（演示）')
}

async function resetPassword(user: SystemUser): Promise<void> {
  await ElMessageBox.confirm(`确定重置「${user.name}」的密码吗？重置后默认密码为 123456`, '重置密码', { type: 'warning' })
  ElMessage.success('密码已重置（演示）')
}

onMounted(loadUsers)
</script>

<template>
  <div class="page-container">
    <PageHeader title="用户管理" description="用户账号增删改查、状态启停与密码重置；实施单位默认仅可查看本单位项目" />

    <div class="pims-card">
      <SearchFilter v-model="query" :filters="filters" @search="search" @reset="reset">
        <template #extra>
          <el-button v-permission="['系统管理员']" type="primary" :icon="Plus" @click="openCreate">新增用户</el-button>
        </template>
      </SearchFilter>
    </div>

    <div class="pims-card">
      <div class="pims-card__title">
        用户列表
        <span class="pims-card__extra">共 {{ filteredList.length }} 个账号</span>
      </div>
      <el-table v-loading="loading" :data="filteredList" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="account" label="账号" width="130" />
        <el-table-column label="角色" width="130">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="row.role === '系统管理员' ? 'danger' : row.role === '内容审核员' ? 'warning' : 'primary'">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="org" label="所属单位" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }"><StatusBadge :status="row.status" size="small" /></template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-button v-permission="['系统管理员']" text type="primary" size="small" @click="toggleStatus(row)">
              {{ row.status === '启用' ? '停用' : '启用' }}
            </el-button>
            <el-button v-permission="['系统管理员']" text type="warning" size="small" @click="resetPassword(row)">重置密码</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <EmptyState text="暂无符合条件的用户" />
        </template>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingUser ? '编辑用户' : '新增用户'" width="480px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="账号" required>
          <el-input v-model="form.account" placeholder="请输入登录账号" :disabled="!!editingUser" />
        </el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="r in ROLE_OPTIONS" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位">
          <el-input v-model="form.org" placeholder="请输入所属单位" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="启用">启用</el-radio>
            <el-radio value="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

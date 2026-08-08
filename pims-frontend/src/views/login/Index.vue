<script setup lang="ts">
/**
 * 系统登录页（PRD 5.1）
 */
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { required } from '@/utils/validate'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ account: 'zhangxm', password: '123456' })

const rules: FormRules = {
  account: [required('请输入用户名')],
  password: [required('请输入密码')]
}

/** 演示账号快捷填充 */
const demoAccounts = [
  { account: 'zhangxm', label: '项目实施单位' },
  { account: 'lish', label: '内容审核员' },
  { account: 'zhaold', label: '管理层' },
  { account: 'admin', label: '系统管理员' }
]

function fill(account: string): void {
  form.account = account
  form.password = '123456'
}

async function handleLogin(): Promise<void> {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const ok = await userStore.login(form.account, form.password)
    if (!ok) {
      ElMessage.error('用户名或密码错误')
      return
    }
    ElMessage.success('登录成功，正在进入系统…')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <div class="login__card">
      <div class="login__logo">投</div>
      <h1 class="login__title">投资项目管理辅助系统</h1>
      <p class="login__sub">Project Investment Management Auxiliary System</p>

      <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent="handleLogin">
        <el-form-item prop="account">
          <el-input v-model="form.account" :prefix-icon="User" placeholder="请输入用户名" autocomplete="username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            show-password
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button class="login__btn" type="primary" size="large" :loading="loading" native-type="submit">
          登 录
        </el-button>
      </el-form>

      <div class="login__links">
        <el-link type="info" @click="ElMessage.info('请联系系统管理员重置密码')">忘记密码？</el-link>
        <el-link type="info" @click="ElMessage.info('请联系系统管理员开通账号')">申请账号</el-link>
      </div>

      <div class="login__tip">
        <div class="login__tip-title">演示账号（密码均为 123456，点击填充）</div>
        <div class="login__tip-accounts">
          <el-tag
            v-for="acc in demoAccounts"
            :key="acc.account"
            class="login__tip-tag"
            :type="form.account === acc.account ? 'primary' : 'info'"
            effect="plain"
            @click="fill(acc.account)"
          >
            {{ acc.label }} {{ acc.account }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.login {
  min-height: 100vh;
  @include flex-center;
  background: linear-gradient(135deg, #0b1f3a 0%, #123a75 45%, #2563eb 100%);
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }

  &::before { width: 520px; height: 520px; top: -160px; right: -120px; }
  &::after { width: 380px; height: 380px; bottom: -140px; left: -100px; }

  &__card {
    width: 420px;
    max-width: calc(100vw - 32px);
    background: #fff;
    border-radius: var(--pims-radius-xl);
    padding: 40px 42px 34px;
    box-shadow: 0 24px 64px rgba(4, 18, 46, 0.35);
    position: relative;
    z-index: 2;
  }

  &__logo {
    width: 44px;
    height: 44px;
    margin: 0 auto var(--pims-space-2);
    border-radius: 11px;
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    color: #fff;
    font-size: 19px;
    font-weight: 700;
    @include flex-center;
  }

  &__title {
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    letter-spacing: 1px;
  }

  &__sub {
    text-align: center;
    color: var(--pims-text-tertiary);
    font-size: 12px;
    margin: var(--pims-space-2) 0 28px;
  }

  &__btn {
    width: 100%;
    margin-top: var(--pims-space-1);
  }

  &__links {
    display: flex;
    justify-content: space-between;
    margin-top: var(--pims-space-3);
  }

  &__tip {
    margin-top: 22px;
    padding: 10px var(--pims-space-3);
    background: var(--pims-primary-light);
    border-radius: var(--pims-radius-md);
  }

  &__tip-title {
    font-size: 12px;
    color: var(--pims-text-secondary);
    margin-bottom: var(--pims-space-2);
  }

  &__tip-accounts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--pims-space-2);
  }

  &__tip-tag {
    cursor: pointer;
  }
}
</style>

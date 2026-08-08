<script setup lang="ts">
/**
 * 404 页面不存在（规范 3.5：NotFound）
 */
import { useRouter } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found__code">404</div>
    <h2 class="not-found__title">页面不存在</h2>
    <p class="not-found__desc text-tertiary">您访问的页面可能已被删除、重命名或暂时不可用。</p>
    <el-button type="primary" :icon="HomeFilled" @click="router.push('/dashboard')">返回首页</el-button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.not-found {
  min-height: 100vh;
  @include flex-center;
  flex-direction: column;
  gap: var(--pims-space-3);
  background: var(--pims-surface);

  &__code {
    font-size: 96px;
    font-weight: 600;
    line-height: 1;
    color: var(--pims-primary);
    letter-spacing: 2px;
  }

  &__title {
    font-size: 22px;
    font-weight: 500;
    color: var(--pims-text-primary);
  }
}
</style>

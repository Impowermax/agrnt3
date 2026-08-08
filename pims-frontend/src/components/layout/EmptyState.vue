<script setup lang="ts">
/**
 * 空状态占位（规范 4.4 EmptyState）
 */
import { DocumentDelete } from '@element-plus/icons-vue'

interface Props {
  /** 提示文字 */
  text?: string
}

withDefaults(defineProps<Props>(), { text: '暂无数据' })
</script>

<template>
  <div class="empty-state">
    <el-icon class="empty-state__icon"><DocumentDelete /></el-icon>
    <p class="empty-state__text">{{ text }}</p>
    <div class="empty-state__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  padding: var(--pims-space-8) 0;
  text-align: center;

  &__icon {
    font-size: 40px;
    color: var(--pims-text-quaternary);
  }

  &__text {
    margin-top: var(--pims-space-2);
    font-size: 13px;
    color: var(--pims-text-tertiary);
  }

  &__actions {
    margin-top: var(--pims-space-3);
  }
}
</style>

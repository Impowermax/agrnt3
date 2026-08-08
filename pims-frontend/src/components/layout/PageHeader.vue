<script setup lang="ts">
/**
 * 页面标题栏：标题 + 描述 + 操作按钮区（规范 4.4 PageHeader）
 */
interface Props {
  /** 页面标题 */
  title: string
  /** 描述文字 */
  description?: string
}

withDefaults(defineProps<Props>(), { description: '' })
</script>

<template>
  <div class="page-header">
    <div class="page-header__text">
      <h2 class="page-header__title">{{ title }}</h2>
      <p v-if="description" class="page-header__desc">{{ description }}</p>
    </div>
    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--pims-space-4);
  margin-bottom: var(--pims-space-4);

  &__title {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--pims-text-primary);
  }

  &__desc {
    margin-top: var(--pims-space-1);
    font-size: 12px;
    color: var(--pims-text-tertiary);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    flex: none;
  }
}
</style>

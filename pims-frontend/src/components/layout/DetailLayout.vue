<script setup lang="ts">
/**
 * 详情页布局：左侧导航 + 右侧详情面板（规范 4.4 DetailLayout）
 */
interface Props {
  /** 左侧宽度 */
  asideWidth?: string
}

withDefaults(defineProps<Props>(), { asideWidth: '250px' })
</script>

<template>
  <div class="detail-layout" :style="{ gridTemplateColumns: `${asideWidth} 1fr` }">
    <div class="detail-layout__aside">
      <slot name="aside" />
    </div>
    <div class="detail-layout__body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.detail-layout {
  display: grid;
  gap: var(--pims-space-4);
  align-items: start;

  &__aside {
    position: sticky;
    top: calc(var(--pims-header-height) + var(--pims-space-5));
  }

  &__body {
    min-width: 0;
  }

  @include respond-to(lg) {
    grid-template-columns: 1fr !important;

    &__aside {
      position: static;
    }
  }
}
</style>

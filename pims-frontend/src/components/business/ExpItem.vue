<script setup lang="ts">
/**
 * 经验库条目卡片（规范 4.3 ExpItem）
 */
import { Star } from '@element-plus/icons-vue'
import type { Experience } from '@/types/exp'

interface Props {
  /** 经验记录 */
  exp: Experience
}

defineProps<Props>()
const emit = defineEmits<{ 'item-click': [exp: Experience] }>()
</script>

<template>
  <div class="exp-item" @click="emit('item-click', exp)">
    <div class="exp-item__tags">
      <el-tag size="small" type="primary" effect="light">{{ exp.stage }}</el-tag>
      <el-tag size="small" type="success" effect="light">{{ exp.step }}</el-tag>
    </div>
    <h4 class="exp-item__title"><el-icon><Star /></el-icon>{{ exp.title }}</h4>
    <p class="exp-item__desc">{{ exp.desc }}</p>
    <div class="exp-item__foot">
      <span>关联项目：{{ exp.project }}</span>
      <span class="num">{{ exp.date }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.exp-item {
  @include card-base;
  display: flex;
  flex-direction: column;
  gap: var(--pims-space-2);
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--pims-shadow-md);
    border-color: var(--pims-success);
  }

  &__tags {
    display: flex;
    gap: var(--pims-space-2);
    flex-wrap: wrap;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--pims-space-1);
    font-size: 14px;
    font-weight: 600;
    color: var(--pims-text-primary);

    .el-icon {
      color: var(--pims-success);
    }
  }

  &__desc {
    font-size: 13px;
    line-height: 1.8;
    color: var(--pims-text-secondary);
    @include text-ellipsis-multi(3);
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    gap: var(--pims-space-2);
    font-size: 12px;
    color: var(--pims-text-tertiary);
    border-top: 1px dashed var(--pims-border);
    padding-top: var(--pims-space-2);
  }
}
</style>

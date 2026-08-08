<script setup lang="ts">
/**
 * 问题库条目卡片（规范 4.3 IssueItem）
 */
import type { Issue } from '@/types/issue'

interface Props {
  /** 问题记录 */
  issue: Issue
}

defineProps<Props>()
const emit = defineEmits<{ 'item-click': [issue: Issue] }>()
</script>

<template>
  <div class="issue-item" @click="emit('item-click', issue)">
    <div class="issue-item__tags">
      <el-tag size="small" type="primary" effect="light">{{ issue.stage }}</el-tag>
      <el-tag size="small" type="warning" effect="light">{{ issue.step }}</el-tag>
    </div>
    <p class="issue-item__desc">{{ issue.desc }}</p>
    <div class="issue-item__foot">
      <span>关联项目：{{ issue.project }}</span>
      <span class="num">{{ issue.date }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.issue-item {
  @include card-base;
  display: flex;
  flex-direction: column;
  gap: var(--pims-space-2);
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--pims-shadow-md);
    border-color: var(--pims-primary);
  }

  &__tags {
    display: flex;
    gap: var(--pims-space-2);
    flex-wrap: wrap;
  }

  &__desc {
    font-size: 13px;
    line-height: 1.8;
    color: var(--pims-text-primary);
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

<script setup lang="ts">
/**
 * 统计数字卡片：大数字 + 标签（规范 4.3 StatCard / 2.3 Display 层级）
 */
import type { Component } from 'vue'

interface Props {
  /** 数值（已格式化） */
  value: string | number
  /** 标签 */
  label: string
  /** 单位 */
  unit?: string
  /** 图标组件 */
  icon?: Component
  /** 图标底色 */
  iconBg?: string
}

withDefaults(defineProps<Props>(), { unit: '', icon: undefined, iconBg: 'var(--pims-primary-light)' })
</script>

<template>
  <div class="stat-card">
    <div v-if="icon" class="stat-card__icon" :style="{ background: iconBg }">
      <el-icon :size="22"><component :is="icon" /></el-icon>
    </div>
    <div class="stat-card__body">
      <div class="stat-card__value num">
        {{ value }}<small v-if="unit" class="stat-card__unit">{{ unit }}</small>
      </div>
      <div class="stat-card__label">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.stat-card {
  @include card-base;
  display: flex;
  align-items: center;
  gap: var(--pims-space-4);

  &__icon {
    width: 46px;
    height: 46px;
    flex: none;
    border-radius: var(--pims-radius-lg);
    color: var(--pims-primary);
    @include flex-center;
  }

  &__value {
    font-size: 28px;
    font-weight: 500;
    line-height: 1.2;
    color: var(--pims-text-primary);
  }

  &__unit {
    margin-left: var(--pims-space-1);
    font-size: 12px;
    font-weight: 400;
    color: var(--pims-text-tertiary);
  }

  &__label {
    margin-top: var(--pims-space-1);
    font-size: 12px;
    color: var(--pims-text-tertiary);
  }
}
</style>

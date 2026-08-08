<script setup lang="ts">
/**
 * 项目信息卡片（规范 4.3 ProjectCard）
 * 展示项目编号、名称、状态、阶段、金额
 */
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import { formatAmount } from '@/utils/format'
import type { Project } from '@/types/project'

interface Props {
  /** 项目 */
  project: Project
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'card-click': [project: Project] }>()

/** 全生命周期进度（12 阶段） */
const progress = computed(() => Math.round((props.project.stageId / 12) * 100))
</script>

<template>
  <div class="project-card" @click="emit('card-click', project)">
    <div class="project-card__head">
      <span class="project-card__no num">PIMS-{{ String(project.id).padStart(4, '0') }}</span>
      <StatusBadge :status="project.status" size="small" />
    </div>
    <h4 class="project-card__name" :title="project.name">{{ project.name }}</h4>
    <div class="project-card__meta">
      <el-tag size="small" effect="plain" :type="project.type === '信息化投资项目' ? 'warning' : 'primary'">
        {{ project.type }}
      </el-tag>
      <span class="text-tertiary">{{ project.stage }}</span>
    </div>
    <el-progress :percentage="progress" :stroke-width="8" :show-text="false" class="project-card__progress" />
    <div class="project-card__foot">
      <span class="project-card__amount num">{{ formatAmount(project.amount) }} <small>万元</small></span>
      <span class="text-tertiary num">{{ project.date }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.project-card {
  @include card-base;
  display: flex;
  flex-direction: column;
  gap: var(--pims-space-2);
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--pims-shadow-md);
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__no {
    font-size: 12px;
    color: var(--pims-text-tertiary);
    font-family: var(--pims-font-mono);
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    @include text-ellipsis;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
  }

  &__progress {
    margin: var(--pims-space-1) 0;
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  &__amount {
    font-size: 16px;
    font-weight: 600;
    color: var(--pims-primary);

    small {
      font-size: 12px;
      font-weight: 400;
      color: var(--pims-text-tertiary);
    }
  }
}
</style>

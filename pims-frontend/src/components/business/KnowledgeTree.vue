<script setup lang="ts">
/**
 * 知识库树形展开组件：阶段 / 环节折叠导航（规范 4.3 KnowledgeTree）
 */
import type { Stage } from '@/types/project'

interface Props {
  /** 阶段列表 */
  stages: Stage[]
  /** 当前选中阶段 */
  activeStageId: number
  /** 当前选中环节索引 */
  activeStepIndex: number
  /** 当前所处阶段标记（项目详情页使用） */
  currentStageId?: number
}

withDefaults(defineProps<Props>(), { currentStageId: 0 })

const emit = defineEmits<{
  select: [stageId: number, stepIndex: number]
}>()
</script>

<template>
  <div class="knowledge-tree">
    <div v-for="stage in stages" :key="stage.id" class="knowledge-tree__stage">
      <div
        class="knowledge-tree__head"
        :class="{ 'knowledge-tree__head--open': stage.id === activeStageId }"
        @click="emit('select', stage.id, 0)"
      >
        <span class="knowledge-tree__no">{{ stage.id }}</span>
        <span class="knowledge-tree__name">{{ stage.name }}</span>
        <el-tag v-if="stage.id === currentStageId" size="small" type="primary" effect="dark" class="knowledge-tree__current">
          当前
        </el-tag>
      </div>
      <div v-if="stage.id === activeStageId" class="knowledge-tree__steps">
        <div
          v-for="(step, index) in stage.steps"
          :key="step.name"
          class="knowledge-tree__step"
          :class="{ 'knowledge-tree__step--active': index === activeStepIndex }"
          @click="emit('select', stage.id, index)"
        >
          {{ step.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/mixins.scss' as *;

.knowledge-tree {
  @include card-base;
  padding: var(--pims-space-2);
  max-height: calc(100vh - var(--pims-header-height) - 120px);
  overflow-y: auto;
  @include custom-scrollbar;

  &__stage {
    margin-bottom: var(--pims-space-1);
  }

  &__head {
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
    padding: 9px 10px;
    border-radius: var(--pims-radius-md);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: background 150ms ease-out;

    &:hover {
      background: var(--pims-primary-light);
    }

    &--open {
      color: var(--pims-primary);
    }
  }

  &__no {
    width: 20px;
    height: 20px;
    flex: none;
    border-radius: var(--pims-radius-sm);
    background: var(--pims-primary-light);
    color: var(--pims-primary);
    font-size: 11px;
    @include flex-center;
  }

  &__name {
    @include text-ellipsis;
  }

  &__current {
    margin-left: auto;
    flex: none;
  }

  &__steps {
    padding: 2px 0 var(--pims-space-1) 38px;
  }

  &__step {
    font-size: 12.5px;
    color: var(--pims-text-secondary);
    padding: 6px var(--pims-space-2);
    border-radius: var(--pims-radius-sm);
    cursor: pointer;
    transition: color 150ms ease-out, background 150ms ease-out;

    &:hover {
      color: var(--pims-primary);
    }

    &--active {
      color: var(--pims-primary);
      background: var(--pims-primary-light);
      font-weight: 600;
    }
  }
}
</style>

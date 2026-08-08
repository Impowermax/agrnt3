<script setup lang="ts">
/**
 * 项目全生命周期阶段时间轴（规范 4.3 StageTimeline）
 * 支持点击切换阶段；已完成 / 当前 / 未开始三态展示
 */
import type { Stage } from '@/types/project'
import { Check } from '@element-plus/icons-vue'

interface Props {
  /** 阶段列表 */
  stages: Stage[]
  /** 项目当前所处阶段序号 */
  current: number
  /** 当前选中查看的阶段序号 */
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
  'stage-click': [stageId: number]
}>()

function stageState(id: number): 'done' | 'current' | 'pending' {
  if (id < props.current) return 'done'
  if (id === props.current) return 'current'
  return 'pending'
}

function handleClick(id: number): void {
  emit('update:modelValue', id)
  emit('stage-click', id)
}
</script>

<template>
  <div class="stage-timeline">
    <div
      v-for="stage in stages"
      :key="stage.id"
      class="stage-timeline__item"
      :class="[
        `stage-timeline__item--${stageState(stage.id)}`,
        { 'stage-timeline__item--selected': stage.id === modelValue }
      ]"
      :title="stage.name"
      @click="handleClick(stage.id)"
    >
      <span class="stage-timeline__dot">
        <el-icon v-if="stageState(stage.id) === 'done'" :size="10"><Check /></el-icon>
      </span>
      <span class="stage-timeline__name">{{ stage.id }}. {{ stage.name }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stage-timeline {
  display: flex;
  overflow-x: auto;
  padding: var(--pims-space-2) 2px var(--pims-space-3);

  &__item {
    flex: 1;
    min-width: 96px;
    text-align: center;
    position: relative;
    padding-top: 26px;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 9px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--pims-text-quaternary);
    }

    &:first-child::before { left: 50%; }
    &:last-child::before { right: 50%; }
  }

  &__dot {
    position: absolute;
    top: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--pims-text-quaternary);
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__name {
    font-size: 12px;
    line-height: 1.4;
    padding: 0 var(--pims-space-1);
    color: var(--pims-text-tertiary);
    display: block;
  }

  /* 已完成 */
  &__item--done {
    &::before { background: var(--pims-success); }
    .stage-timeline__dot { border-color: var(--pims-success); background: var(--pims-success); }
    .stage-timeline__name { color: var(--pims-success); }
  }

  /* 当前阶段 */
  &__item--current {
    &::before { background: linear-gradient(90deg, var(--pims-success), var(--pims-text-quaternary)); }
    .stage-timeline__dot {
      border-color: var(--pims-primary);
      background: var(--pims-primary);
      box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.18);
    }
    .stage-timeline__name { color: var(--pims-primary); font-weight: 600; }
  }

  /* 选中态 */
  &__item--selected .stage-timeline__name {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>

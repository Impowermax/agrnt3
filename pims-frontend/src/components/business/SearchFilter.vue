<script setup lang="ts">
/**
 * 通用搜索筛选栏（规范 4.3 SearchFilter）
 * 支持关键字 + 下拉筛选 + 查询/重置，v-model 绑定查询对象
 */
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import type { FilterConfig } from '@/types/common'

interface Props {
  /** 筛选项配置 */
  filters: FilterConfig[]
  /** 查询条件对象（v-model） */
  modelValue: Record<string, unknown>
}

defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  search: []
  reset: []
}>()

function updateField(key: string, value: unknown, model: Record<string, unknown>): void {
  emit('update:modelValue', { ...model, [key]: value })
}
</script>

<template>
  <div class="search-filter">
    <div v-for="filter in filters" :key="filter.key" class="search-filter__field">
      <label class="search-filter__label">{{ filter.label }}</label>
      <el-input
        v-if="filter.type === 'input'"
        :model-value="modelValue[filter.key] as string"
        :placeholder="filter.placeholder || `请输入${filter.label}`"
        clearable
        class="search-filter__control"
        @update:model-value="updateField(filter.key, $event, modelValue)"
        @keyup.enter="emit('search')"
      />
      <el-select
        v-else
        :model-value="modelValue[filter.key] as string | number"
        :placeholder="filter.placeholder || '全部'"
        clearable
        class="search-filter__control"
        @update:model-value="updateField(filter.key, $event ?? '', modelValue)"
      >
        <el-option v-for="opt in filter.options" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </div>
    <div class="search-filter__actions">
      <el-button type="primary" :icon="Search" @click="emit('search')">查 询</el-button>
      <el-button :icon="RefreshLeft" @click="emit('reset')">重 置</el-button>
    </div>
    <div v-if="$slots.extra" class="search-filter__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pims-space-3);
  align-items: flex-end;

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--pims-space-1);
  }

  &__label {
    font-size: 12px;
    color: var(--pims-text-tertiary);
  }

  &__control {
    width: 220px;
  }

  &__actions {
    display: flex;
    gap: var(--pims-space-2);
  }

  &__extra {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--pims-space-2);
  }
}
</style>

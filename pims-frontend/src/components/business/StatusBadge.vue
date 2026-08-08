<script setup lang="ts">
/**
 * 状态徽章：按业务状态自动映射语义色（规范 2.2-3 状态语义色映射 / 4.3 StatusBadge）
 */
import { computed } from 'vue'

interface Props {
  /** 业务状态文字 */
  status: string
  /** 尺寸 */
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), { size: 'default' })

type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/* 规范 2.2（3）：新增→Info、拟建→Warning、在建→Primary、建设完毕→Success、
   审核通过→Success、待审核→Warning、审核驳回→Danger */
const STATUS_TYPE_MAP: Record<string, TagType> = {
  新增项目: 'info',
  拟建项目: 'warning',
  在建项目: 'primary',
  建设完毕: 'success',
  审核通过: 'success',
  待审核: 'warning',
  审核驳回: 'danger',
  启用: 'success',
  停用: 'info',
  问题: 'warning',
  经验: 'success'
}

const tagType = computed<TagType>(() => STATUS_TYPE_MAP[props.status] || 'info')
</script>

<template>
  <el-tag :type="tagType" :size="size" effect="light" class="status-badge">{{ status }}</el-tag>
</template>

<style scoped>
.status-badge {
  border-radius: var(--pims-radius-sm);
}
</style>

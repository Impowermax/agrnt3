/** 表格通用逻辑（规范 7.4：分页、加载态） */
import { ref, computed, type Ref } from 'vue'

export interface UseTableOptions<T> {
  /** 数据加载函数（支持同步返回或 Promise） */
  fetcher: () => Promise<T[]> | T[]
  /** 每页条数（默认 20，规范 4.6） */
  pageSize?: number
  /** 是否立即加载 */
  immediate?: boolean
}

export interface UseTableReturn<T> {
  list: Ref<T[]>
  pagedList: Ref<T[]>
  loading: Ref<boolean>
  pageNum: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  load: () => Promise<void>
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
}

/**
 * 表格通用组合式函数：数据加载 + 前端分页（后端分页时替换 fetcher 为分页接口）
 */
export function useTable<T>(options: UseTableOptions<T>): UseTableReturn<T> {
  const list = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(options.pageSize ?? 20)
  const total = computed(() => list.value.length)

  const pagedList = computed(() => {
    const start = (pageNum.value - 1) * pageSize.value
    return list.value.slice(start, start + pageSize.value)
  }) as Ref<T[]>

  async function load(): Promise<void> {
    loading.value = true
    try {
      list.value = await options.fetcher()
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number): void {
    pageNum.value = page
  }

  function handleSizeChange(size: number): void {
    pageSize.value = size
    pageNum.value = 1
  }

  if (options.immediate !== false) {
    void load()
  }

  return { list, pagedList, loading, pageNum, pageSize, total, load, handlePageChange, handleSizeChange }
}

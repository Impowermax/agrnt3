/** 搜索筛选通用逻辑（规范 7.4：问题库/经验库/项目列表复用） */
import { ref, type Ref, type UnwrapRef } from 'vue'

export interface UseSearchOptions<Q extends Record<string, unknown>> {
  /** 初始查询条件 */
  defaultQuery: Q
  /** 查询执行函数 */
  onSearch: (query: Q) => void | Promise<void>
}

export interface UseSearchReturn<Q extends Record<string, unknown>> {
  query: Ref<UnwrapRef<Q>>
  search: () => void
  reset: () => void
}

/**
 * 搜索筛选组合式函数：维护查询条件、触发查询、重置
 */
export function useSearch<Q extends Record<string, unknown>>(options: UseSearchOptions<Q>): UseSearchReturn<Q> {
  const query = ref({ ...options.defaultQuery }) as Ref<UnwrapRef<Q>>

  function search(): void {
    void options.onSearch({ ...query.value } as Q)
  }

  function reset(): void {
    query.value = { ...options.defaultQuery } as UnwrapRef<Q>
    search()
  }

  return { query, search, reset }
}

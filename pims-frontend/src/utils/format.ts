/** 格式化工具（规范：utils/format.ts，所有模块共享） */

/** 金额千分位格式化：12800 -> "12,800" */
export function formatAmount(n: number | null | undefined): string {
  if (n === null || n === undefined) return '-'
  return n.toLocaleString('zh-CN')
}

/** 万元转亿元展示：45240 -> "4.52 亿元" */
export function formatAmountYi(n: number): string {
  return `${(n / 10000).toFixed(2)}`
}

/** 日期格式化：Date/string -> "YYYY-MM-DD" */
export function formatDate(d: Date | string | number): string {
  const date = d instanceof Date ? d : new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 百分比：0.333 -> "33.3%" */
export function formatPercent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`
}

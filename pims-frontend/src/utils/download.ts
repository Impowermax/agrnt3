/** 文件下载工具（规范：utils/download.ts，导出功能共享） */

/** 触发浏览器下载 Blob 文件 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 将二维表格导出为 CSV（Excel 可直接打开，含 BOM 防乱码）
 * 说明：真实 Excel(.xlsx) 导出建议由后端生成后通过 service 下载
 */
export function exportTableToCsv(headers: string[], rows: (string | number)[][], filename: string): void {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const lines = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))]
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`)
}

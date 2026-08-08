/** 表单校验规则（规范：utils/validate.ts，表单组件共享） */
import type { FormItemRule } from 'element-plus'

/** 必填 */
export const required = (message = '该项为必填项'): FormItemRule => ({ required: true, message, trigger: 'blur' })

/** 必填（下拉/日期，change 触发） */
export const requiredSelect = (message = '请选择'): FormItemRule => ({ required: true, message, trigger: 'change' })

/** 手机号 */
export const mobileRule: FormItemRule = {
  pattern: /^1[3-9]\d{9}$/,
  message: '请输入正确的手机号',
  trigger: 'blur'
}

/** 金额（正数，最多两位小数） */
export const amountRule: FormItemRule = {
  pattern: /^\d+(\.\d{1,2})?$/,
  message: '请输入正确的金额（最多两位小数）',
  trigger: 'blur'
}

/** 长度限制 */
export const maxLength = (max: number): FormItemRule => ({
  max,
  message: `长度不能超过 ${max} 个字符`,
  trigger: 'blur'
})

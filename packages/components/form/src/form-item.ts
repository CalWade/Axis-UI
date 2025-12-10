//form-item

import { RuleItem } from 'async-validator'
import { ExtractPropTypes, InjectionKey, PropType } from 'vue'

export type Arrayable<T> = T | T[] //定义一个类型，可以是T类型或者T类型的数组

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>
}

export const formItemValidateState = ['success', 'error', '']
export type FormItemValidateState = (typeof formItemValidateState)[number]

export const formItemProps = {
  prop: String,
  label: String,
  rules: [Object, Array] as PropType<Arrayable<FormItemRule>>,
  showMessage: {
    type: Boolean,
    default: true,
  },
} as const

export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>
//表单每一项的上下文
export interface FormItemContext extends FormItemProps {
  validate: (
    trigger: string,
    callback?: (isValid: boolean) => void
  ) => Promise<void>
}

export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('')

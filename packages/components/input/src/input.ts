//type 属性 默认是text

import { ExtractPropTypes, PropType } from 'vue'

//v-model = modelValue + @update:modelValue

//placeholder 默认展示的内容

//clearable 清除输入框的内容

//show-password 切换密码可见不可见

//disabled

//readonly

//label

export const inputProps = {
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  placeholder: {
    type: String,
  },
  clearable: {
    type: Boolean,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
} as const

export type inputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear: () => true,//清空事件
}

export type inputEmits = typeof inputEmits
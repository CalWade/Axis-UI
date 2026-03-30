import { ExtractPropTypes, PropType } from 'vue'

export const checkboxProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
  },
  indeterminate: Boolean,
  disabled: Boolean,
  label: {
    type: String as PropType<string>,
  },
} as const

export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>

export const checkboxEmits = {
  'update:modelValue': (val: boolean | string | number) =>
    typeof val === 'boolean' || typeof val === 'string' || typeof val === 'number',
  change: (val: boolean) => typeof val === 'boolean',
}

export type CheckboxEmits = typeof checkboxEmits

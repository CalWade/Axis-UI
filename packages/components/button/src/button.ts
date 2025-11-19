//存储组件的属性和相关事件

import { ExtractPropTypes, PropType } from "vue"

//size 按钮尺寸
export type Size = 'large' | 'medium' | 'small' | 'mini'
//type 不同样式展示不同类型
export type Type =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'default'
//round 圆角

//loading 加载状态

//disabled 禁用状态

//native-type 原生按钮类型
export type NativeType = 'button' | 'submit' | 'reset'
//icon-placement 图标位置
export type IconPlacement = 'left' | 'right'
//插槽 icon




export const buttonProps = {
  size: String as PropType<Size>,
  type: {//写成对象形式是为了加校验器
    type: String as PropType<Type>,
    validator: (val: string) => {
      return ['primary', 'success', 'warning', 'danger', 'info', 'default'].includes(val)
    },
    default: '',
  },
  round:Boolean,
  loading: Boolean,
  disabled: Boolean,
  nativeType: {
    type: String as PropType<NativeType>,
    default: 'button',
  },
  iconPlacement: {
    type: String as PropType<IconPlacement>,
    default: 'left',
  },
}as const

export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent,
  mousedown: (e: MouseEvent) => e instanceof MouseEvent,
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmits = typeof buttonEmits
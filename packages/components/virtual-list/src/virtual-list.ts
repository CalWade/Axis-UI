import { ExtractPropTypes, PropType } from 'vue'

export const virtualListProps = {
  /** 每项的固定高度（px） */
  size: {
    type: Number,
    default: 32,
  },
  /** 可视区域内保留的条目数 */
  remain: {
    type: Number,
    default: 8,
  },
  /** 数据列表 */
  items: {
    type: Array as PropType<unknown[]>,
    default: () => [],
  },
} as const

export type VirtualListProps = ExtractPropTypes<typeof virtualListProps>

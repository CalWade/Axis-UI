import { withInstall } from '@axis-ui/utils'
import '@axis-ui/theme-chalk/src/common/var.scss'
import '@axis-ui/theme-chalk/src/virtual-list.scss'
import _Virtual from './src/virtual'

export const VirtualList = withInstall(_Virtual)

export default VirtualList

export * from './src/virtual'
export * from './src/virtual-list'

declare module 'vue' {
  export interface GlobalComponents {
    AxVirtualList: typeof VirtualList
  }
}

import { withInstall } from '@axis-ui/utils'
import _Virtual from './src/virtual'

export const VirtualList = withInstall(_Virtual)

export default VirtualList

export * from './src/virtual'

declare module 'vue' {
  export interface GlobalComponents {
    AxVirtualList: typeof VirtualList
  }
}

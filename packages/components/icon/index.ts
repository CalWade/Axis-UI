import { withInstall } from '@axis-ui/utils'
import '@axis-ui/theme-chalk/src/common/var.scss'
import '@axis-ui/theme-chalk/src/icon.scss'
import _Icon from './src/icon.vue'

export const Icon = withInstall(_Icon)

export default Icon

export * from './src/icon'

//引用模板后有组件注释了
declare module 'vue' {
  export interface GlobalComponents {
    //我们的接口合并到全局组件
    AxIcon: typeof Icon
  }
}

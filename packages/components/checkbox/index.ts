import { withInstall } from '@axis-ui/utils'
import '@axis-ui/theme-chalk/src/common/var.scss'
import '@axis-ui/theme-chalk/src/checkbox.scss'
import _Checkbox from './src/checkbox.vue'

export const Checkbox = withInstall(_Checkbox)

export default Checkbox

export * from './src/checkbox'

declare module 'vue' {
  export interface GlobalComponents {
    AxCheckbox: typeof Checkbox
  }
}

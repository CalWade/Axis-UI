import { withInstall } from '@axis-ui/utils'
import '@axis-ui/theme-chalk/src/common/var.scss'
import '@axis-ui/theme-chalk/src/button.scss'
import _Button from './src/button.vue'

export const Button = withInstall(_Button)

export default Button

export * from './src/button'

declare module 'vue' {
  export interface GlobalComponents {
    AxButton: typeof Button
  }
}

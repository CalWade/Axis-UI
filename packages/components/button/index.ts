import { withInstall } from '@axis-ui/utils'
import _Button from './src/button.vue'

export const Button = withInstall(_Button)

export default Button

export * from './src/button'

declare module 'vue' {
  export interface GlobalComponents {
    AxButton: typeof Button
  }
}

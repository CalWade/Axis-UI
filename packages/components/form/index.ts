import { withInstall } from '@axis-ui/utils'
import '@axis-ui/theme-chalk/src/common/var.scss'
import '@axis-ui/theme-chalk/src/form.scss'
import _Form from './src/form.vue'
import _FormItem from './src/form-item.vue'

const Form = withInstall(_Form)
const FormItem = withInstall(_FormItem)

export { FormItem, Form }

export * from './src/form'
export * from './src/form-item'

export type FormInstance = InstanceType<typeof Form>

declare module 'vue' {
  export interface GlobalComponents {
    AxForm: typeof Form
    AxFormItem: typeof FormItem
  }
}

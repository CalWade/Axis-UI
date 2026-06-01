import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

/** 为组件挂载 install 方法，使其可被 app.use() 全局注册 */
export function withInstall<T>(comp: T) {
  ;(comp as SFCWithInstall<T>).install = (app: App) => {
    const { name } = comp as unknown as { name: string }
    app.component(name, comp as SFCWithInstall<T>)
  }
  return comp as SFCWithInstall<T>
}

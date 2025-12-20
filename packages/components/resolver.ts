import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * Axis-UI Resolver
 * 用于 unplugin-vue-components，实现自动按需引入组件和样式
 */
export function AxisUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      // 检查组件名是否以 Ax 开头 (例如 AxButton)
      if (name.startsWith('Ax')) {
        const partialName = name.slice(2) // 得到 Button
        const kebabName = partialName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

        return {
          name: partialName, // 导出名，如 Button
          from: `axis-ui/${kebabName}`, // 路径，如 axis-ui/button
          sideEffects: `@axis-ui/theme-chalk/dist/${kebabName}.css`,
        }
      }
    },
  }
}

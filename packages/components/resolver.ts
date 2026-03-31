import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * Axis-UI Resolver
 * 配合 unplugin-vue-components 实现自动按需引入组件 + 样式
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import { AxisUIResolver } from 'axis-ui/resolver'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [AxisUIResolver()],
 *     }),
 *   ],
 * })
 * ```
 *
 * 使用后在模板中直接写 <AxButton>，自动引入组件 JS 和对应的 CSS。
 */
export function AxisUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith('Ax')) return

      const partialName = name.slice(2) // AxButton → Button

      // 子组件 → 父组件的映射
      const subComponentMap: Record<string, string> = {
        FormItem: 'form',
        TreeNode: 'tree',
        TreeNodeContent: 'tree',
      }

      // 组件名 → 包路径的映射（处理特殊命名）
      const nameMap: Record<string, string> = {
        VirtualList: 'virtual-list',
        FormItem: 'form',
      }

      const parentDir = subComponentMap[partialName]
      const kebabName =
        nameMap[partialName] ??
        partialName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      const cssDir = parentDir ?? kebabName

      return {
        name: partialName,
        from: `axis-ui/${parentDir ?? kebabName}`,
        sideEffects: [
          // 基础变量（:root CSS Variables + 暗色主题）
          '@axis-ui/theme-chalk/dist/common/var.css',
          '@axis-ui/theme-chalk/dist/common/dark.css',
          // 组件样式
          `@axis-ui/theme-chalk/dist/${cssDir}.css`,
        ],
      }
    },
  }
}

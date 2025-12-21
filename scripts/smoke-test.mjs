import { Button, Icon, Checkbox, Input, Tree, VirtualList, Form, FormItem } from '../packages/components/dist/index.js'
import { withInstall } from '../packages/utils/dist/index.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

console.log('🚀 开始构建产物冒烟测试...')

// 1. 检查核心导出
const components = { Button, Icon, Checkbox, Input, Tree, VirtualList, Form, FormItem }
for (const [name, component] of Object.entries(components)) {
  if (!component) {
    console.error(`❌ 错误: ${name} 组件导出失败`)
    process.exit(1)
  }
}
console.log('✅ 组件导入测试通过')

if (!withInstall) {
  console.error('❌ 错误: 工具函数导出失败')
  process.exit(1)
}
console.log('✅ 工具函数导入测试通过')

// 2. 检查物理文件是否存在
const filesToCheck = [
  // 主包产物
  'packages/components/dist/index.js',
  'packages/components/dist/index.umd.js',
  'packages/components/dist/style.css',
  // 工具包产物
  'packages/utils/dist/index.mjs',
  // 样式文件 (Theme Chalk)
  'packages/theme-chalk/dist/index.css',
  'packages/theme-chalk/dist/button.css',
  'packages/theme-chalk/dist/icon.css',
  'packages/theme-chalk/dist/checkbox.css',
  'packages/theme-chalk/dist/input.css',
  'packages/theme-chalk/dist/tree.css',
  'packages/theme-chalk/dist/virtual-list.css',
  'packages/theme-chalk/dist/form.css',
  // 'packages/theme-chalk/dist/form-item.css', // 包含在 form.css 中
  // 组件 JS 产物 (Tree-shaking 支持)
  'packages/components/dist/button/index.js',
  'packages/components/dist/icon/index.js',
  'packages/components/dist/checkbox/index.js',
  'packages/components/dist/input/index.js',
  'packages/components/dist/tree/index.js',
  'packages/components/dist/virtual-list/index.js',
  'packages/components/dist/form/index.js',
  // 'packages/components/dist/form-item/index.js', // FormItem 在 form 包中
]

for (const file of filesToCheck) {
  const filePath = path.resolve(projectRoot, file)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 错误: 找不到产物文件 ${file}`)
    process.exit(1)
  }
}
console.log('✅ 产物文件完整性测试通过')

console.log('🎉 冒烟测试全部通过！构建产物可用。')

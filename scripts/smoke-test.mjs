import { Button, Icon } from '../packages/components/dist/index.js'
import { withInstall } from '../packages/utils/dist/index.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

console.log('🚀 开始构建产物冒烟测试...')

// 1. 检查核心导出
if (!Button) {
  console.error('❌ 错误: Button 组件导出失败')
  process.exit(1)
}
if (!Icon) {
  console.error('❌ 错误: Icon 组件导出失败')
  process.exit(1)
}
console.log('✅ 组件导入测试通过')

if (!withInstall) {
  console.error('❌ 错误: 工具函数导出失败')
  process.exit(1)
}
console.log('✅ 工具函数导入测试通过')

// 2. 检查物理文件是否存在
const filesToCheck = [
  'packages/components/dist/index.js',
  'packages/components/dist/index.umd.js',
  'packages/components/dist/style.css',
  'packages/theme-chalk/dist/index.css',
  'packages/utils/dist/index.mjs'
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

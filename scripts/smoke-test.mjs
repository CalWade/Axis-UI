// 构建产物冒烟测试：验证「用户 npm install 后真实拿到的东西」，而不是仓库里的 dist。
//
// 之前的版本只从 dist 目录导入做检查，测不到打包边界——线上 axis-ui@0.0.3
// 的 dependencies 带着未重写的 workspace:* 协议发布（安装即失败），这类事故
// 只有走一遍真实的 pack → install → import 链路才能拦住。
//
// 流程：
//   1. pnpm pack 三个包（pnpm 会执行与 publish 相同的清单准备，含 workspace 协议重写）
//   2. 在系统临时目录搭一个消费者项目，用 npm 安装 tarball（overrides 强制内部依赖走本地）
//   3. 以消费者身份 import 主入口 / 子路径 / resolver，校验导出、样式与包元数据
//
// 前置条件：pnpm build:all
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cssLoaderHook = path.join(root, 'scripts/css-loader-hook.mjs')
const PACKAGES = [
  'packages/utils',
  'packages/theme-chalk',
  'packages/components',
]

const run = (cmd, cwd) =>
  execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'inherit'] })
    .toString()
    .trim()

const fail = msg => {
  console.error(`❌ ${msg}`)
  process.exit(1)
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'axis-ui-smoke-'))
console.log(`🚀 开始产物冒烟测试（${tmp}）`)

// 1. pack
const tarballs = {}
for (const rel of PACKAGES) {
  const dir = path.join(root, rel)
  const { name } = JSON.parse(
    fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
  )
  const output = run(`pnpm pack --pack-destination "${tmp}"`, dir)
  const tarball = output.split('\n').pop().trim()
  if (!fs.existsSync(tarball)) fail(`${name} pack 失败：${output}`)
  tarballs[name] = tarball
  console.log(`📦 ${name} → ${path.basename(tarball)}`)
}

// 2. 消费者项目安装
fs.writeFileSync(
  path.join(tmp, 'package.json'),
  JSON.stringify(
    {
      name: 'axis-ui-smoke-consumer',
      private: true,
      type: 'module',
      // 内部依赖强制解析到本地 tarball，避免误从 registry 拉线上旧版本
      overrides: {
        '@axis-ui/utils': `file:${tarballs['@axis-ui/utils']}`,
        '@axis-ui/theme-chalk': `file:${tarballs['@axis-ui/theme-chalk']}`,
      },
    },
    null,
    2
  )
)
run(
  `npm install "${tarballs['axis-ui']}" vue@^3.5.0 --no-audit --no-fund --loglevel=error`,
  tmp
)
console.log('✅ tarball 可安装（workspace:* 协议已被正确重写）')

// 3. 包元数据回归检查
const installed = JSON.parse(
  fs.readFileSync(path.join(tmp, 'node_modules/axis-ui/package.json'), 'utf8')
)
if (JSON.stringify(installed.dependencies ?? {}).includes('workspace:')) {
  fail(
    'axis-ui 的 dependencies 含未重写的 workspace 协议（0.0.3 线上事故复发）'
  )
}
if (!installed.sideEffects) {
  fail('axis-ui 缺少 sideEffects 声明，样式会被 Tree-shaking 误删')
}
if (fs.existsSync(path.join(tmp, 'node_modules/axis-ui/dist/node_modules'))) {
  fail('第三方依赖被误打包进 dist（rollup external 漏配）')
}
console.log('✅ 包元数据检查通过')

// 4. 消费者视角导入测试
fs.writeFileSync(
  path.join(tmp, 'consume.mjs'),
  `
import assert from 'node:assert'
import { Button, Icon, Checkbox, Input, Tree, VirtualList, Form, FormItem } from 'axis-ui'
import AxButton from 'axis-ui/button'
import { AxisUIResolver } from 'axis-ui/resolver'
import { withInstall, createNamespace } from '@axis-ui/utils'

for (const [name, comp] of Object.entries({ Button, Icon, Checkbox, Input, Tree, VirtualList, Form, FormItem })) {
  assert.ok(comp, name + ' 导出缺失')
  assert.ok(comp.install, name + ' 缺少 install（withInstall 未生效）')
}
assert.ok(AxButton.install, '子路径 axis-ui/button 导入失败')
assert.equal(typeof AxisUIResolver, 'function', 'axis-ui/resolver 导出失败')
assert.ok(withInstall && createNamespace, '@axis-ui/utils 导出失败')
console.log('✅ 消费者导入测试通过（主入口 / 子路径 / resolver / utils）')
`
)
execSync(`node --import "${cssLoaderHook}" consume.mjs`, {
  cwd: tmp,
  stdio: 'inherit',
})

// 5. 样式产物完整性
const mustExist = [
  'node_modules/axis-ui/dist/style.css',
  'node_modules/axis-ui/dist/index.umd.js',
  ...[
    'index',
    'button',
    'icon',
    'checkbox',
    'input',
    'tree',
    'virtual-list',
    'form',
  ].map(name => `node_modules/@axis-ui/theme-chalk/dist/${name}.css`),
]
for (const rel of mustExist) {
  if (!fs.existsSync(path.join(tmp, rel))) fail(`找不到产物文件 ${rel}`)
}
// 回归检查：SCSS partial 误编译会产出近乎空的 css 文件
const themeDist = path.join(tmp, 'node_modules/@axis-ui/theme-chalk/dist')
for (const file of fs.readdirSync(themeDist, { recursive: true })) {
  const filePath = path.join(themeDist, String(file))
  if (filePath.endsWith('.css') && fs.statSync(filePath).size < 16) {
    fail(`疑似空样式产物 ${file}（partial 未加下划线前缀？）`)
  }
}
console.log('✅ 样式产物完整性检查通过')

fs.rmSync(tmp, { recursive: true, force: true })
console.log('🎉 冒烟测试全部通过：发布产物可被真实消费')

// 为声明文件中的相对导入补全扩展名。
//
// vite-plugin-dts 按源码原样输出 `from './icon'` 这类无扩展名导入，
// 但在 node16/nodenext 的 ESM 类型解析下，目录导入与无扩展名文件导入
// 都不合法（TS 会按 './icon.js' / './icon/index.js' 的字面量匹配 d.ts）。
// 这里按产物的真实目录结构改写：文件 → './icon.js'，目录 → './icon/index.js'。
//
// 用法：node scripts/fix-dts-extensions.mjs <types目录>
import fs from 'node:fs'
import path from 'node:path'

const typesDir = process.argv[2]
if (!typesDir || !fs.existsSync(typesDir)) {
  console.error(
    `用法: node fix-dts-extensions.mjs <types目录>（收到: ${typesDir}）`
  )
  process.exit(1)
}

// 匹配相对说明符，含裸 '.' / '..'（TS 会为自引用类型发出 import('.')）
const SPECIFIER_RE =
  /(from\s+|import\s*\(\s*|import\s+)(['"])(\.{1,2}(?:\/[^'"]+)?)\2/g

let rewritten = 0
const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.name.endsWith('.d.ts')) continue

    const source = fs.readFileSync(full, 'utf8')
    const next = source.replace(SPECIFIER_RE, (match, prefix, quote, spec) => {
      if (/\.(js|mjs|cjs|json|css|scss)$/.test(spec)) return match
      const resolved = path.resolve(path.dirname(full), spec)
      if (fs.existsSync(path.join(resolved, 'index.d.ts'))) {
        rewritten++
        return `${prefix}${quote}${spec}/index.js${quote}`
      }
      if (fs.existsSync(`${resolved}.d.ts`)) {
        rewritten++
        return `${prefix}${quote}${spec}.js${quote}`
      }
      return match
    })
    if (next !== source) fs.writeFileSync(full, next)
  }
}

walk(typesDir)
console.log(`✅ d.ts 扩展名修正完成（${typesDir}，改写 ${rewritten} 处导入）`)

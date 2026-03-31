# 性能基准测试

Axis-UI 建立了组件性能基准测试体系，用数据衡量包体积和核心算法性能。

---

## 包体积分析

### 测试方法

```bash
# 1. 构建组件库
pnpm build:all

# 2. 用 npm pack 生成 tarball（与 npm publish 完全相同的打包流程）
cd packages/components && npm pack
cd packages/utils && npm pack
cd packages/theme-chalk && npm pack

# 3. 创建空白 Vite 项目，从 tarball 安装（模拟用户 npm install）
mkdir test-project && cd test-project
pnpm add vue@3 vite@7 @vitejs/plugin-vue ./axis-ui-0.0.2.tgz ...

# 4. 编写不同引入方式的 main.ts
# 5. vite build，Vue 作为 external 排除（只测组件库本身的体积）
# 6. 读取 Vite 输出的产物体积
```

**测试环境**：Linux x64 / Node 22 / Vite 7.1 / pnpm 10

### 结果

以下所有 JS 体积**不含 Vue 运行时**（Vue 被设为 external）。

| 引入方式 | 代码写法 | JS 体积 | gzip 后 |
| --- | --- | --- | --- |
| 全量引入 | `import AxisUI from 'axis-ui'` | 32.82 KB | 11.28 KB |
| 按需 Button | `import { Button } from 'axis-ui'` | 2.65 KB | 1.22 KB |
| 按需 VirtualList | `import { VirtualList } from 'axis-ui'` | 3.97 KB | 1.74 KB |
| 按需 Tree | `import { Tree } from 'axis-ui'` | 10.24 KB | 4.02 KB |
| 按需 Form 全家桶 | `import { Form, FormItem, Input, Button } from 'axis-ui'` | 23.83 KB | 8.15 KB |
| subpath Button | `import { Button } from 'axis-ui/button'` | 2.65 KB | 1.22 KB |

<details>
<summary>注意事项与已知问题</summary>

**Tree-shaking 如何实现的：**
- 每个组件在 `index.ts` 中自引自己的 SCSS（如 `button/index.ts` 引入 `button.scss`）
- 主入口 `index.ts` 不包含全局 CSS 副作用导入
- `package.json` 中 `sideEffects: ["**/*.css", "**/*.scss"]` 告知 Rollup 只有样式文件有副作用
- 因此 `import { Button } from 'axis-ui'` 和 subpath `from 'axis-ui/button'` 效果完全一致

**已知问题：**
- CSS 在测试中没有输出为独立文件，因为样式是通过 SCSS 源文件引入的，需要用户项目安装 `sass` 依赖
- 推荐用户项目安装 `sass` 作为 devDependency，或使用 AxisUIResolver 自动引入编译后的 CSS

**Form 全家桶 23.83 KB 的原因：**
- 其中 `async-validator`（Form 校验依赖）约占 23 KB
- 组件自身代码（Form + FormItem + Input + Button）约 0.8 KB
- 不使用 Form 组件时，async-validator 不会被打包

</details>

### 按需引入减少比例

| 组件 | 全量体积 | 按需体积 | 减少比例 |
| --- | --- | --- | --- |
| Button | 32.82 KB | 2.65 KB | **91.9%** |
| VirtualList | 32.82 KB | 3.97 KB | **87.9%** |
| Tree | 32.82 KB | 10.24 KB | **68.8%** |

<details>
<summary>计算方式</summary>

减少比例 = (全量 JS - 按需 JS) / 全量 JS × 100%

例：Button = (32.82 - 2.65) / 32.82 × 100% = 91.9%

均为 Vite build 产物的原始 JS 体积（非 gzip），Vue 被 external 排除。

</details>

---

## 算法性能

### 测试方法

```bash
# vitest bench 模式 — 输出 ops/sec，不做 pass/fail 断言
pnpm bench
```

使用 `vitest bench` 内置的 benchmark 模式，在 Node.js 中运行。纯算法测试，不涉及 DOM 渲染。

**测试环境**：Linux x64 / Node 22 / 2 核 4GB 云服务器。不同机器结果会有差异。

### VirtualList

| 操作 | 数据量 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 固定高度查找 (`scrollTop / size`) | 100K | ~14,000,000 | ~0.0001ms |
| `getTotalHeight`（遍历累加） | 100K | ~430 | ~2.3ms |
| `findStartIndex`（近起点） | 100K | ~240 | ~4.2ms |
| `findStartIndex`（中间） | 100K | ~73 | ~13.7ms |
| `findStartIndex`（近末尾） | 100K | ~30 | ~33ms |
| `getTotalHeight` | 10K | ~7,580 | ~0.13ms |
| `findStartIndex`（中间） | 10K | ~2,760 | ~0.36ms |

<details>
<summary>测试条件与已知局限</summary>

**测试条件：**
- 30% 的项有真实测量高度缓存（模拟用户已滚动过的区域），其余使用预估高度
- `findStartIndex` 使用二分查找定位

**已知局限：**
- `findStartIndex` 的二分查找本身是 O(log n)，但每次迭代中 `getItemOffset` 需要从头累加高度，因此总复杂度实际为 **O(n log n)**
- 100K 数据在中间位置查找需 ~14ms，接近 16ms 的 60fps 帧预算
- **优化方向**：引入前缀和数组缓存，将 `getItemOffset` 从 O(n) 优化到 O(1)，使总复杂度降为 O(log n)
- 固定高度模式不受此限制，始终 O(1)
- 在实际使用中，10K 条数据是更常见的场景（findStartIndex 仅需 0.36ms）

</details>

### Tree

| 操作 | 节点数 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 全展开扁平化 | 1,110 | ~49,000 | ~0.02ms |
| 30% 展开扁平化 | 1,110 | ~317,000 | ~0.003ms |
| 无展开（仅根节点） | 1,110 | ~4,150,000 | ~0.0002ms |
| 全展开扁平化 | 11,110 | ~2,530 | ~0.4ms |
| 30% 展开扁平化 | 11,110 | ~129,000 | ~0.008ms |

<details>
<summary>测试条件</summary>

- 树结构：depth=3 breadth=10（1,110 节点）/ depth=4 breadth=10（11,110 节点）
- 使用栈迭代扁平化算法（与组件源码相同）
- 扁平化不包含 DOM 渲染时间

</details>

---

## 运行 Benchmark

```bash
# 算法性能（输出 ops/sec 报告）
pnpm bench

# 浏览器 FPS 测试（手动打开）
# open benchmark/index.html
```

---

## 性能设计要点

### VirtualList

- **固定高度**：`O(1)` 查找（`scrollTop / size`），1400 万次/秒
- **动态高度**：二分查找 + 高度缓存。10K 数据 0.36ms 满足实时滚动需求；100K 数据是当前瓶颈（优化方向：前缀和数组）
- **缓冲区渲染**：可视区域上下各一屏，防快速滚动白屏
- **ResizeObserver**：自动测量真实高度，缓存后不重复测量

### Tree

- **栈迭代扁平化**：不用递归，不会栈溢出
- **按需展开**：只遍历展开的节点，未展开直接跳过
- **虚拟滚动集成**：复用 VirtualList 渲染，万级节点无压力

### 包体积

- **per-component CSS imports**：每个组件自引自己的样式，主入口无全局 CSS 副作用
- **`sideEffects` 声明**：告知 Rollup 只有 CSS/SCSS 有副作用，JS 可安全 tree-shake
- **第三方依赖隔离**：async-validator 仅在 Form 组件中引用，按需引入时不包含
- **主入口和 subpath 效果一致**：`import { Button } from 'axis-ui'` 等同于 `from 'axis-ui/button'`

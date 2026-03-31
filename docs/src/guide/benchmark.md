# 性能基准测试

Axis-UI 建立了组件性能基准测试体系，用数据衡量核心算法性能和包体积。

## 包体积分析

> 以下数据通过 `npm pack` + Vite build 实测，Vue 作为 external 不计入。

### 全量引入 vs 按需引入

| 引入方式 | JS 体积 | gzip 后 | 相比全量减少 |
| --- | --- | --- | --- |
| 全量引入 `import AxisUI from 'axis-ui'` | 32.17 KB | 10.85 KB | — |
| 按需 Button `from 'axis-ui/button'` | 2.64 KB | 1.19 KB | **91.8%** |
| 按需 VirtualList `from 'axis-ui/virtual-list'` | 4.00 KB | 1.72 KB | **87.6%** |
| 按需 Tree `from 'axis-ui/tree'` | 10.03 KB | 3.87 KB | **68.8%** |
| CSS（全量） | 8.44 KB | 1.83 KB | — |

### 体积构成

全量 32.17 KB 中：

- `async-validator`（Form 校验依赖）：23.29 KB（72%）
- 组件自身代码：~9 KB（28%）

不使用 Form 组件时，按需引入不会包含 async-validator。

### 测试方法

```bash
# 1. 构建组件库
pnpm build:all

# 2. 打包 tarball（模拟 npm publish）
cd packages/components && npm pack

# 3. 在空白 Vite 项目中安装并构建
mkdir test-project && cd test-project
pnpm add vue ./axis-ui-0.0.2.tgz
# 编写不同引入方式的 main.ts，分别 vite build 对比产物体积
```

### 按需引入方式

```ts
// 方式一：subpath imports（推荐，tree-shaking 最优）
import { Button } from 'axis-ui/button'
import { VirtualList } from 'axis-ui/virtual-list'

// 方式二：搭配 unplugin-vue-components 自动按需
import Components from 'unplugin-vue-components/vite'
import { AxisUIResolver } from 'axis-ui/resolver'
```

---

## 算法性能

### 运行方式

```bash
# vitest bench 模式 — 输出 ops/sec，不做 pass/fail
pnpm bench

# 浏览器 FPS 测试
# 打开 benchmark/index.html
```

### VirtualList

> 以下数据在 Linux x64 / Node 22 上测得，不同机器会有差异。

| 操作 | 数据量 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 固定高度查找 (`scrollTop / size`) | 100K | ~14,000,000 | ~0.0001ms |
| `getTotalHeight` | 100K | ~430 | ~2.3ms |
| `findStartIndex`（近起点） | 100K | ~240 | ~4.2ms |
| `findStartIndex`（中间） | 100K | ~73 | ~13.7ms |
| `findStartIndex`（近末尾） | 100K | ~30 | ~33ms |
| `getTotalHeight` | 10K | ~7,580 | ~0.13ms |
| `findStartIndex`（中间） | 10K | ~2,760 | ~0.36ms |

### Tree

| 操作 | 节点数 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 全展开扁平化 | 1K | ~49,000 | ~0.02ms |
| 30% 展开扁平化 | 1K | ~317,000 | ~0.003ms |
| 无展开（仅根节点） | 1K | ~4,150,000 | ~0.0002ms |
| 全展开扁平化 | 10K | ~2,530 | ~0.4ms |
| 30% 展开扁平化 | 10K | ~129,000 | ~0.008ms |

---

## 性能设计要点

### VirtualList

- **固定高度**：`O(1)` 查找（`scrollTop / size`），1400 万次/秒
- **动态高度**：`O(log n)` 二分查找 + 高度缓存，10K 数据 0.36ms
- **缓冲区渲染**：可视区域上下各一屏，防快速滚动白屏
- **ResizeObserver**：自动测量真实高度，缓存后不重复测量

### Tree

- **栈迭代扁平化**：不用递归，不会栈溢出
- **按需展开**：只遍历展开的节点，未展开的直接跳过
- **虚拟滚动集成**：复用 VirtualList，万级节点无压力

### 包体积

- **ESM subpath exports**：每个组件独立入口，Vite/Rollup 只打包实际使用的组件
- **第三方依赖隔离**：async-validator 仅在 Form 组件中引用，按需引入时不被包含
- **CSS Custom Properties**：样式通过 CSS 变量驱动，运行时可切换主题

# 性能基准测试

Axis-UI 建立了组件性能基准测试体系，用数据衡量核心算法性能和包体积。

## 包体积分析

### 全量引入 vs 按需引入

| 引入方式 | JS 体积 | gzip 后 | 相比全量减少 |
| --- | --- | --- | --- |
| 全量引入 `import AxisUI from 'axis-ui'` | 32.17 KB | 10.85 KB | — |
| 按需 Button `from 'axis-ui/button'` | 2.64 KB | 1.19 KB | **91.8%** |
| 按需 VirtualList `from 'axis-ui/virtual-list'` | 4.00 KB | 1.72 KB | **87.6%** |
| 按需 Tree `from 'axis-ui/tree'` | 10.03 KB | 3.87 KB | **68.8%** |
| CSS（全量，暂不支持按需） | 8.44 KB | 1.83 KB | — |

<details>
<summary>测试条件与注意事项</summary>

**测试方法：**
1. `pnpm build:all` 构建组件库
2. `npm pack` 生成 tarball（与 npm publish 相同的打包逻辑）
3. 在空白 Vite 项目中 `pnpm add ./axis-ui-0.0.2.tgz` 安装
4. 编写不同引入方式的 `main.ts`，`vite build`（Vue 作为 external）
5. 读取 Vite 输出的产物体积（含 gzip）

**注意：**
- 按需引入使用 **subpath imports**（如 `import { Button } from 'axis-ui/button'`），不是从主入口 `import { Button } from 'axis-ui'`
- 从主入口 `import { Button } from 'axis-ui'` 由于 CSS 副作用，Vite 不会 tree-shake，体积与全量引入基本一致
- CSS 目前全量引入（8.44 KB），暂未实现按组件拆分 CSS

</details>

### 体积构成

全量 32.17 KB 中：

| 部分 | 体积 | 占比 |
| --- | --- | --- |
| async-validator（Form 校验依赖） | 23.29 KB | 72% |
| 组件自身代码（8 个组件） | ~9 KB | 28% |

不使用 Form 组件时，按需引入不会包含 async-validator。

---

## 算法性能

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

**测试方法：**
- 使用 `vitest bench`（vitest 内置的 benchmark 模式），运行 `pnpm bench`
- 纯算法测试，不涉及 DOM 渲染
- 30% 的项有真实测量高度缓存，其余使用预估高度

**测试环境：**
- Linux x64 / Node 22 / 2 核 4GB 云服务器
- 不同机器结果会有差异，数据仅供参考

**已知局限：**
- `findStartIndex` 使用二分查找（O(log n) 次迭代），但每次迭代中 `getItemOffset` 需要从头累加（O(n)），总复杂度为 **O(n log n)**，非纯 O(log n)
- 100K 数据在中间位置查找需 ~14ms，接近 16ms 帧预算。实际使用中可通过**前缀和数组缓存**优化到 O(log n)，这是后续优化方向
- 固定高度模式（`scrollTop / size`）不受此限制，始终 O(1)

</details>

### Tree

| 操作 | 节点数 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 全展开扁平化 | 1K | ~49,000 | ~0.02ms |
| 30% 展开扁平化 | 1K | ~317,000 | ~0.003ms |
| 无展开（仅根节点） | 1K | ~4,150,000 | ~0.0002ms |
| 全展开扁平化 | 10K | ~2,530 | ~0.4ms |
| 30% 展开扁平化 | 10K | ~129,000 | ~0.008ms |

<details>
<summary>测试条件</summary>

**测试方法：**
- 使用 `vitest bench`，运行 `pnpm bench`
- 树结构：depth=3 breadth=10（1,110 节点）/ depth=4 breadth=10（11,110 节点）
- 使用栈迭代扁平化（与组件源码相同的算法）

**测试环境：** 同上

</details>

---

## 运行 Benchmark

```bash
# 算法性能（vitest bench，输出 ops/sec）
pnpm bench

# 浏览器 FPS 测试（手动打开，交互测试）
# 打开 benchmark/index.html
```

---

## 性能设计要点

### VirtualList

- **固定高度**：`O(1)` 查找，1400 万次/秒
- **动态高度**：二分查找 + 高度缓存，10K 数据 0.36ms（100K 数据是当前瓶颈，优化方向：前缀和数组）
- **缓冲区渲染**：可视区域上下各一屏，防快速滚动白屏
- **ResizeObserver**：自动测量真实高度，缓存后不重复测量

### Tree

- **栈迭代扁平化**：不用递归，不会栈溢出
- **按需展开**：只遍历展开的节点，未展开的直接跳过
- **虚拟滚动集成**：复用 VirtualList，万级节点无压力

### 包体积

- **ESM subpath exports**：每个组件独立入口，需通过 subpath 引入才能 tree-shake
- **第三方依赖隔离**：async-validator 仅在 Form 组件中引用
- **CSS Custom Properties**：样式通过 CSS 变量驱动，运行时可切换主题

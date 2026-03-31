# 性能基准测试

Axis-UI 建立了组件性能基准测试体系，用数据衡量核心算法性能。

## 运行方式

### 算法 Benchmark（vitest bench）

```bash
pnpm bench
```

输出每个操作的 **ops/sec**（每秒执行次数）、平均耗时、百分位数据。这是纯数据报告，不做 pass/fail 判断——因为性能数据受机器配置影响，CI 和本地结果会有差异。

### 浏览器 FPS 测试

在浏览器中打开 `benchmark/index.html`，可交互测试：

- VirtualList 固定高度 100K 项自动滚动，记录实时 FPS
- VirtualList 动态高度 100K 项自动滚动
- Tree 展开 1000+ 节点耗时
- 核心算法执行时间

## Benchmark 数据示例

> 以下数据在 Linux x64 / Node 22 上测得，不同机器会有差异。

### VirtualList

| 操作 | 数据量 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 固定高度查找 | 100K | ~14,000,000 | ~0.0001ms |
| getTotalHeight | 100K | ~430 | ~2.3ms |
| findStartIndex（近起点） | 100K | ~240 | ~4.2ms |
| findStartIndex（中间） | 100K | ~73 | ~13.7ms |
| findStartIndex（近末尾） | 100K | ~30 | ~33ms |
| getTotalHeight | 10K | ~7,580 | ~0.13ms |
| findStartIndex（中间） | 10K | ~2,760 | ~0.36ms |

### Tree

| 操作 | 节点数 | ops/sec | 平均耗时 |
| --- | --- | --- | --- |
| 全展开扁平化 | 1K | ~49,000 | ~0.02ms |
| 30% 展开扁平化 | 1K | ~317,000 | ~0.003ms |
| 无展开（仅根节点） | 1K | ~4,150,000 | ~0.0002ms |
| 全展开扁平化 | 10K | ~2,530 | ~0.4ms |
| 30% 展开扁平化 | 10K | ~129,000 | ~0.008ms |

## 性能设计要点

### VirtualList

- **固定高度**：`O(1)` 查找（`scrollTop / size`），1400 万次/秒
- **动态高度**：`O(log n)` 二分查找，10K 数据 0.36ms
- **缓冲区渲染**：可视区域上下各一屏，防快速滚动白屏
- **ResizeObserver**：自动测量真实高度，逐步收敛

### Tree

- **栈迭代扁平化**：不用递归，不会栈溢出
- **按需展开**：只遍历展开的节点，未展开的直接跳过
- **虚拟滚动集成**：复用 VirtualList，万级节点无压力

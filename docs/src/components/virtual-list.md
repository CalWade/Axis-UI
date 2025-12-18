# VirtualList 虚拟列表

用于高效渲染大量数据的虚拟滚动列表组件。

## 概述

当需要渲染大量数据时，传统的渲染方式会创建大量 DOM 节点，导致页面卡顿。虚拟列表通过只渲染可见区域的元素来解决这个问题。

## 基础用法

<demo src="./demos/virtual-list/Basic.vue"></demo>

## 工作原理

1. **可视区域计算**：根据容器高度和每项高度计算可见项数量
2. **滚动监听**：监听滚动事件，计算当前应该显示哪些数据
3. **偏移量计算**：通过 CSS `transform` 来模拟滚动位置
4. **缓冲区**：在可见区域上下各保留一屏数据，防止快速滚动时出现空白

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| items | 列表数据 | `any[]` | - | `[]` |
| size | 每一项的高度（像素） | `number` | - | `32` |
| remain | 可见区域显示的项数 | `number` | - | `8` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义列表项内容 | `{ node: any }` |

## 使用示例

```vue
<template>
  <AxVirtualList :items="items" :remain="10" :size="50">
    <template #default="{ node }">
      <div class="item">{{ node.name }}</div>
    </template>
  </AxVirtualList>
</template>

<script setup>
import { AxVirtualList } from '@axis-ui/components'

// 生成大量数据
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
}))
</script>

<style>
.item {
  height: 50px;
  line-height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}
</style>
```

## 注意事项

> [!IMPORTANT]
> 每个列表项的高度必须固定为 `size` 属性指定的值，否则滚动计算会出现偏差。

> [!TIP]
> 合理设置 `remain` 值，一般等于容器能显示的完整项数即可。过大会增加不必要的渲染。

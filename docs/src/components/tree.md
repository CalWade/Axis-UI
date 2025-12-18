# Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

基础的树形结构展示。

<demo src="./demos/tree/Basic.vue"></demo>

## 可选择

设置 `selectable` 属性可以让节点变为可选择状态。

<demo src="./demos/tree/Selectable.vue"></demo>

## 复选框

使用 `show-checkbox` 属性可以为树提供复选框支持。

<demo src="./demos/tree/Checkbox.vue"></demo>

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| data | 展示数据 | `TreeOption[]` | - | `[]` |
| defaultExpandedKeys | 默认展开的节点的 key 数组 | `(string \| number)[]` | - | `[]` |
| keyField | 每个树节点用作唯一标识的属性名 | `string` | - | `key` |
| labelField | 指定节点标签为节点对象的某个属性值 | `string` | - | `label` |
| childrenField | 指定子树为节点对象的某个属性值 | `string` | - | `children` |
| selectable | 是否可选择 | `boolean` | - | `true` |
| multiple | 是否支持多选 | `boolean` | - | `false` |
| selectedKeys / v-model:selected-keys | 选中的节点 key 数组 | `(string \| number)[]` | - | - |
| showCheckbox | 是否显示复选框 | `boolean` | - | `false` |
| defaultCheckedKeys | 默认选中的节点 key 数组 | `(string \| number)[]` | - | `[]` |
| onLoad | 异步加载数据 | `(node: TreeOption) => Promise<TreeOption[]>` | - | - |

### TreeOption 数据结构

```typescript
interface TreeOption {
  key?: string | number      // 节点唯一标识
  label?: string | number    // 节点显示标签
  children?: TreeOption[]    // 子节点
  isLeaf?: boolean           // 是否为叶子节点
  disabled?: boolean         // 是否禁用
  [key: string]: unknown     // 其他自定义属性
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:selectedKeys | 选中节点变化时触发 | `(keys: (string \| number)[]) => void` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义节点内容 | `{ node: TreeNode }` |

## 使用示例

```vue
<template>
  <AxTree
    :data="treeData"
    :default-expanded-keys="['1']"
    selectable
    v-model:selected-keys="selectedKeys"
  />
</template>

<script setup>
import { ref } from 'vue'
import { AxTree } from '@axis-ui/components'

const selectedKeys = ref([])
const treeData = [
  {
    key: '1',
    label: '节点 1',
    children: [
      { key: '1-1', label: '子节点 1-1' },
      { key: '1-2', label: '子节点 1-2' },
    ],
  },
]
</script>
```

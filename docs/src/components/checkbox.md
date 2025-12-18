# Checkbox 复选框

用于在一组备选项中进行多选。

## 基础用法

单独使用可以表示两种状态之间的切换。

<demo src="./demos/checkbox/Basic.vue"></demo>

## 禁用状态

通过 `disabled` 属性禁用复选框。

<demo src="./demos/checkbox/Disabled.vue"></demo>

## 半选状态

`indeterminate` 属性用以表示复选框的不确定状态，一般用于实现全选的效果。

<demo src="./demos/checkbox/Indeterminate.vue"></demo>

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| modelValue / v-model | 绑定值 | `boolean \| string \| number` | - | - |
| label | 选中状态的值（用于多选时） | `string` | - | - |
| disabled | 是否禁用 | `boolean` | - | `false` |
| indeterminate | 设置为半选状态 | `boolean` | - | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当绑定值变化时触发 | `(value: boolean) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 复选框标签内容 |

## 使用示例

```vue
<template>
  <AxCheckbox v-model="checked">记住我</AxCheckbox>
</template>

<script setup>
import { ref } from 'vue'
import { AxCheckbox } from '@axis-ui/components'

const checked = ref(false)
</script>
```

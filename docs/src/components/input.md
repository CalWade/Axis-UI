# Input 输入框

通过鼠标或键盘输入字符的基础表单组件。

## 基础用法

<demo src="./demos/input/Basic.vue"></demo>

## 可清空

使用 `clearable` 属性可以显示清空按钮。

<demo src="./demos/input/Clearable.vue"></demo>

## 密码框

使用 `show-password` 属性可以切换密码的显示与隐藏。

<demo src="./demos/input/Password.vue"></demo>

## 禁用和只读

通过 `disabled` 和 `readonly` 属性可以设置输入框的禁用和只读状态。

<demo src="./demos/input/Disabled.vue"></demo>

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| type | 输入框类型 | `string` | `text` / `password` / `number` 等 | `text` |
| modelValue / v-model | 绑定值 | `string \| number` | - | - |
| placeholder | 占位文本 | `string` | - | - |
| clearable | 是否可清空 | `boolean` | - | `false` |
| showPassword | 是否显示切换密码图标 | `boolean` | - | `false` |
| disabled | 是否禁用 | `boolean` | - | `false` |
| readonly | 是否只读 | `boolean` | - | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| input | 输入时触发 | `(value: string) => void` |
| change | 值改变时触发 | `(value: string) => void` |
| focus | 获取焦点时触发 | `(event: FocusEvent) => void` |
| blur | 失去焦点时触发 | `(event: FocusEvent) => void` |
| clear | 点击清空按钮时触发 | `() => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| prepend | 输入框前置内容 |
| append | 输入框后置内容 |
| prefixIcon | 输入框头部图标 |
| suffixIcon | 输入框尾部图标 |

## 使用示例

```vue
<template>
  <AxInput v-model="value" placeholder="请输入" clearable />
</template>

<script setup>
import { ref } from 'vue'
import { AxInput } from '@axis-ui/components'

const value = ref('')
</script>
```

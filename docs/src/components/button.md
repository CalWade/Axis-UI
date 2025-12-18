# Button 按钮

常用的操作按钮组件。

## 基础用法

使用 `type` 属性定义按钮的类型。

<demo src="./demos/button/Basic.vue"></demo>

## 不同尺寸

使用 `size` 属性定义按钮的尺寸，支持 `large`、`medium`、`small`、`mini` 四种尺寸。

<demo src="./demos/button/Sizes.vue"></demo>

## 圆角按钮

使用 `round` 属性来定义圆角按钮。

<demo src="./demos/button/Round.vue"></demo>

## 禁用状态

使用 `disabled` 属性来定义按钮是否被禁用。

<demo src="./demos/button/Disabled.vue"></demo>

## 加载状态

使用 `loading` 属性来定义按钮的加载状态。

<demo src="./demos/button/Loading.vue"></demo>

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| type | 按钮类型 | `string` | `primary` / `success` / `warning` / `danger` / `info` / `default` | `default` |
| size | 按钮尺寸 | `string` | `large` / `medium` / `small` / `mini` | - |
| round | 是否为圆角按钮 | `boolean` | - | `false` |
| loading | 是否为加载状态 | `boolean` | - | `false` |
| disabled | 是否禁用 | `boolean` | - | `false` |
| nativeType | 原生 type 属性 | `string` | `button` / `submit` / `reset` | `button` |
| iconPlacement | 图标位置 | `string` | `left` / `right` | `left` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发 | `(event: MouseEvent) => void` |
| mousedown | 鼠标按下时触发 | `(event: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
| icon | 自定义图标 |

## 使用示例

```vue
<template>
  <AxButton type="primary" @click="handleClick">点击我</AxButton>
  <AxButton type="success" loading>加载中</AxButton>
  <AxButton type="danger" disabled>禁用</AxButton>
</template>

<script setup>
import { AxButton } from '@axis-ui/components'

const handleClick = () => {
  console.log('按钮被点击')
}
</script>
```

# Form 表单

用于收集、验证和提交数据的表单组件。

## 基础用法

最基本的表单包含各种输入表单项，以及提交和重置按钮。

<demo src="./demos/form/Basic.vue"></demo>

## 表单验证

Form 组件提供了表单验证的功能，只需要通过 `rules` 属性传入约定的验证规则，并将 FormItem 的 `prop` 属性设置为需要验证的特殊键值即可。

<demo src="./demos/form/Validation.vue"></demo>

## API

### Form Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| model | 表单数据对象 | `object` | - | - |
| rules | 表单验证规则 | `object` | - | - |
| showMessage | 是否显示校验错误信息 | `boolean` | - | `true` |

### Form Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| validate | 对整个表单进行校验 | `(callback?: (valid: boolean, fields?: object) => void) => Promise<boolean>` |

### FormItem Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| prop | 表单域 model 字段 | `string` | - | - |
| label | 标签文本 | `string` | - | - |
| rules | 表单验证规则 | `object \| array` | - | - |
| showMessage | 是否显示校验错误信息 | `boolean` | - | `true` |

### FormItem Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 表单项内容 |
| label | 标签位置的内容 |
| error | 验证错误信息的内容 |

## 验证规则

表单验证基于 [async-validator](https://github.com/yiminghe/async-validator) 库，支持以下验证规则：

```typescript
interface FormItemRule {
  required?: boolean       // 是否必填
  message?: string         // 错误消息
  trigger?: string | string[]  // 触发方式：'blur' | 'change'
  min?: number            // 最小长度
  max?: number            // 最大长度
  type?: string           // 类型：'string' | 'number' | 'email' 等
  pattern?: RegExp        // 正则表达式
  validator?: Function    // 自定义验证函数
}
```

## 使用示例

```vue
<template>
  <AxForm ref="formRef" :model="form" :rules="rules">
    <AxFormItem label="用户名" prop="username">
      <AxInput v-model="form.username" />
    </AxFormItem>
    <AxFormItem>
      <AxButton type="primary" @click="submit">提交</AxButton>
    </AxFormItem>
  </AxForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { AxForm, AxFormItem, AxInput, AxButton } from '@axis-ui/components'

const formRef = ref()
const form = reactive({ username: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
}

const submit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) console.log('提交成功')
}
</script>
```

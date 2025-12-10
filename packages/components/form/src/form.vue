<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { createNamespace } from '@axis-ui/utils/create'
import { FormContext, FormContextKey, formProps } from './form'
import { FormItemContext } from './form-item'
import { provide } from 'vue'
import { Values } from 'async-validator'

const bem = createNamespace('form')
defineOptions({ name: 'AxForm' })

const props = defineProps(formProps)
const fields: FormItemContext[] = []

// form的校验逻辑，在父级中调用所有子级的校验方法
const validate = async (
  callback?: (valid: boolean, fields?: Values) => void
) => {
  let errors: Values = {}
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = { ...errors, ...(error as Values).fields }
    }
  }
  //没有错误返回true
  if (Object.keys(errors).length === 0) {
    if (callback) {
      callback(true)
    }
    return true
  } else {
    //有错误返回false和错误信息
    if (callback) {
      callback?.(false, errors)
    } else {
      //如果没有回调函数，返回一个被拒绝的Promise，包含错误信息
      return Promise.reject(errors)
    }
  }
}

const addField: FormContext['addField'] = context => {
  fields.push(context)

  //console.log('fields:', fields)
}

const context = {
  ...props,
  addField,
}
provide(FormContextKey, context)

//将form表单的校验方法暴露给用户，用户可以通过ref调用
defineExpose({
  validate,
})
</script>

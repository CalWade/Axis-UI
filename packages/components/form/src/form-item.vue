<template>
  <div
    :class="[
      bem.b(),
      bem.is('success', validateState == 'success'),
      bem.is('error', validateState == 'error'),
    ]"
  >
    <label :class="bem.e('label')">
      {{ label }}
      <slot name="label"></slot>
    </label>
    <div :class="bem.e('content')">
      <slot></slot>
      <div
        v-if="validateState === 'error' && props.showMessage"
        :class="bem.e('error')"
      >
        <slot name="error">{{ validateMessage }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@axis-ui/utils'
import { computed, inject, onMounted, provide, ref } from 'vue'
import {
  Arrayable,
  FormItemContext,
  formItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState,
} from './form-item'
import { FormContextKey } from './form'
import AsyncValidator, { Values } from 'async-validator'

const bem = createNamespace('form-item')
const props = defineProps(formItemProps)
const FormContext = inject(FormContextKey)

defineOptions({ name: 'AxFormItem' })

//这里是检验逻辑

const validateState = ref<FormItemValidateState>('')
const validateMessage = ref<string>('')

const converArray = (rules: Arrayable<FormItemRule> | undefined) => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

const _rules = computed(() => {
  const myRules: FormItemRule[] = converArray(props.rules)
  const formRules = FormContext?.rules
  if (formRules && props.prop) {
    const _temp = formRules[props.prop]

    if (_temp) {
      myRules.push(...converArray(_temp))
    }
  }

  return myRules
})
//返回一个新数组，包含所有满足条件的 rule
const getRuleFiltered = (trigger: string) => {
  const rules = _rules.value

  return rules.filter(rule => {
    if (!rule || !trigger) return true
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}

const onValidationSuccessed = () => {
  validateState.value = 'success'
  validateMessage.value = ''
}

const onValidationFailed = (error: { errors: Values; fields: Values }) => {
  validateState.value = 'error'
  //console.log('error:', error)
  const firstError = error?.errors?.[0]
  validateMessage.value = firstError?.message ?? '未知错误'
}

//拿到触发的时机，校验是否通过可以通过调用 callback 来告知
const validate: FormItemContext['validate'] = async trigger => {
  //rules是设定的规则，trigger是触发的规则
  const rules = getRuleFiltered(trigger)
  //console.log('触发校验，trigger为:', trigger, rules)

  const modelName = props.prop!

  const validator = new AsyncValidator({ [modelName]: rules })

  const model = FormContext?.model
  //似乎不成熟的解决方式
  if (!model) {
    return Promise.reject(new Error('FormContext model is undefined'))
  }

  return validator
    .validate({
      [modelName]: model[modelName],
    })
    .then(() => {
      //console.log('校验成功')
      onValidationSuccessed()
    })
    .catch((err: { errors: Values; fields: Values }) => {
      onValidationFailed(err)
      //console.log('校验失败:', err)
      return Promise.reject(err)
    })
}

const context: FormItemContext = {
  ...props,
  validate,
}

provide(formItemContextKey, context)

onMounted(() => {
  FormContext?.addField(context) //将自己的校验逻辑添加到父级的字段列表中
})
</script>

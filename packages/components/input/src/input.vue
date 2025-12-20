<template>
  <div :class="[bem.b()]">
    <div :class="bem.e('group')">
      <div v-if="slots.prepend" :class="[bem.be('group', 'prepend')]">
        <slot name="prepend"></slot>
      </div>

      <div :class="[bem.e('warpper')]">
        <span v-if="slots.prefixIcon">
          <slot name="prefixIcon"></slot>
        </span>

        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          v-bind="attrs"
          :class="bem.e('inner')"
          ref="input"
          @input="handleInput"
          @change="handleChange"
          @blur="handleBlur"
          @focus="handleFocus"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :readonly="props.readonly"
        />

        <span v-if="slots.suffixIcon">
          <slot name="suffixIcon"></slot>
          <ax-icon
            :size="24"
            v-if="showPwdVisible"
            @click="hadnlePasswordVisible"
          >
            <i-codex:checklist></i-codex:checklist>
          </ax-icon>
          <ax-icon :size="24" v-if="showClear" @click="clear">
            <i-codex:cross></i-codex:cross>
          </ax-icon>
        </span>
      </div>

      <div v-if="slots.append" :class="[bem.be('group', 'append')]">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@axis-ui/utils'
import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { inputEmits, inputProps } from './input'
import { formItemContextKey } from '../../form'

const FormItemContext = inject(formItemContextKey)

defineOptions({
  name: 'AxInput',
  inheritAttrs: false,
})

const bem = createNamespace('input')
const slots = useSlots()
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)
const attrs = useAttrs()

// --------------------------
//完成双向绑定、设置原生input的值
const input = ref<HTMLInputElement | null>(null)

const setNativeInputValue = () => {
  if (input.value) {
    input.value.value = String(props.modelValue)
  }
}
onMounted(() => {
  setNativeInputValue()
})
//监控modelValue的变化，变化后设置原生input的值
watch(
  () => props.modelValue,
  () => {
    FormItemContext?.validate('change').catch(() => {}) //通知form-item进行校验
    setNativeInputValue()
  }
)

// --------------------------
const focus = async () => {
  await nextTick //等待DOM更新完成
  input.value?.focus()
}

const passwordVisible = ref(false)
const hadnlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
  focus()
}

const showPwdVisible = computed(() => {
  return (
    props.modelValue && props.showPassword && !props.readonly && !props.disabled
  )
})

// --------------------------

const showClear = computed(() => {
  return (
    props.clearable && props.modelValue && !props.readonly && !props.disabled
  )
})

const clear = () => {
  emit('update:modelValue', '')
  emit('input', '')
  emit('clear')
  focus()
}

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('input', value)
  emit('update:modelValue', value)
}

const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('change', value)
}

const handleBlur = (e: FocusEvent) => {
  emit('blur', e)
  //通知form-item进行校验
  FormItemContext?.validate('blur').catch(() => {})
}

const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}
</script>

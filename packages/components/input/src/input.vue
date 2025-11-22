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

        <input :type="type" :class="bem.e('inner')" />

        <span v-if="slots.suffixIcon">
          <slot name="suffixIcon"></slot>
        </span>
      </div>
      <div v-if="slots.append" :class="[bem.be('group', 'append')]">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createNamespace } from '@axis-ui/utils/create'
import { useSlots } from 'vue'
import { inputEmits, inputProps } from './input'

defineOptions({
  name: 'AxInput',
  inheritAttrs: false,
})

const bem = createNamespace('input')
const slots = useSlots()
defineProps(inputProps)
defineEmits(inputEmits)
</script>

<template>
  <button
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('disabled', disabled),
      bem.is('loading', loading),
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMousedown"
  >
    <template v-if="iconPlacement === 'left'">
      <ax-icon>
        <i-codex:loader v-if="loading"></i-codex:loader>
        <!-- 用户传入自定义icon -->
        <template v-else-if="slots.icon">
          <Component :is="slots.icon"></Component>
        </template>
      </ax-icon>
    </template>
    <slot></slot>
    <template v-if="iconPlacement === 'right'">
      <ax-icon>
        <i-codex:loader v-if="loading"></i-codex:loader>
        <template v-else-if="slots.icon">
          <Component :is="slots.icon"></Component>
        </template>
      </ax-icon>
    </template>
  </button>
</template>

<script lang="ts" setup>
import { createNamespace } from '@axis-ui/utils'
import { buttonEmits, buttonProps } from './button'
import { useSlots } from 'vue'

const bem = createNamespace('button')

defineOptions({ name: 'AxButton' })

defineProps(buttonProps)
const emit = defineEmits(buttonEmits)

const slots = useSlots()

const emitClick = (e: MouseEvent) => {
  emit('click', e)
}

const emitMousedown = (e: MouseEvent) => {
  emit('mousedown', e)
}
</script>

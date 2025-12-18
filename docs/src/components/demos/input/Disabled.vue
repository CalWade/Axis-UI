<template>
  <div class="demo-container">
    <AxInput v-model="disabledInput" placeholder="禁用状态" disabled />
    <AxInput v-model="readonlyInput" placeholder="只读状态" readonly />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxInput from '@packages/components/input/src/input.vue'

const disabledInput = ref('禁用状态的内容')
const readonlyInput = ref('只读状态的内容')
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
</style>

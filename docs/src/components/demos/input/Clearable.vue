<template>
  <div class="demo-container">
    <AxInput v-model="input" placeholder="可清空输入框" clearable />
    <p class="demo-tip">输入内容: {{ input }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxInput from '@packages/components/input/src/input.vue'

const input = ref('可以清空的内容')
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.demo-tip {
  color: #666;
  font-size: 14px;
  margin: 0;
}
</style>

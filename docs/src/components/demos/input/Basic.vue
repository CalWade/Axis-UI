<template>
  <div class="demo-container">
    <AxInput v-model="input" placeholder="请输入内容" />
    <p class="demo-tip">输入内容: {{ input }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxInput from '@packages/components/input/src/input.vue'

const input = ref('')
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

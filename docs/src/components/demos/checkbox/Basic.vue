<template>
  <div class="demo-container">
    <AxCheckbox v-model="checked1" label="选项1">选项1</AxCheckbox>
    <AxCheckbox v-model="checked2" label="选项2">选项2</AxCheckbox>
    <p class="demo-tip">选中状态: 选项1={{ checked1 }}, 选项2={{ checked2 }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxCheckbox from '@packages/components/checkbox/src/checkbox.vue'

const checked1 = ref(true)
const checked2 = ref(false)
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-tip {
  color: #666;
  font-size: 14px;
  margin: 0;
}
</style>

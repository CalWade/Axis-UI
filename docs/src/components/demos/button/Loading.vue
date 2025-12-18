<template>
  <div class="demo-container">
    <AxButton type="primary" loading>加载中</AxButton>
    <AxButton type="success" loading>提交中</AxButton>
    <AxButton type="primary" :loading="isLoading" @click="handleClick">
      {{ isLoading ? '加载中...' : '点击加载' }}
    </AxButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxButton from '@packages/components/button/src/button.vue'

const isLoading = ref(false)

const handleClick = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>

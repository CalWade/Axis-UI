<template>
  <div class="demo-container">
    <AxButton round>圆角按钮</AxButton>
    <AxButton type="primary" round>主要按钮</AxButton>
    <AxButton type="success" round>成功按钮</AxButton>
    <AxButton type="warning" round>警告按钮</AxButton>
    <AxButton type="danger" round>危险按钮</AxButton>
  </div>
</template>

<script setup lang="ts">
import AxButton from '@packages/components/button/src/button.vue'
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>

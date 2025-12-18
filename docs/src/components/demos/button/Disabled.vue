<template>
  <div class="demo-container">
    <AxButton disabled>禁用按钮</AxButton>
    <AxButton type="primary" disabled>主要按钮</AxButton>
    <AxButton type="success" disabled>成功按钮</AxButton>
    <AxButton type="warning" disabled>警告按钮</AxButton>
    <AxButton type="danger" disabled>危险按钮</AxButton>
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

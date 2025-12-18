<template>
  <div class="demo-container">
    <AxButton>默认按钮</AxButton>
    <AxButton type="primary">主要按钮</AxButton>
    <AxButton type="success">成功按钮</AxButton>
    <AxButton type="warning">警告按钮</AxButton>
    <AxButton type="danger">危险按钮</AxButton>
    <AxButton type="info">信息按钮</AxButton>
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

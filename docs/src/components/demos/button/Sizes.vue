<template>
  <div class="demo-container">
    <div class="demo-row">
      <AxButton size="large" type="primary">大号按钮</AxButton>
      <AxButton size="medium" type="primary">中号按钮</AxButton>
      <AxButton size="small" type="primary">小号按钮</AxButton>
      <AxButton size="mini" type="primary">迷你按钮</AxButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AxButton from '@packages/components/button/src/button.vue'
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>

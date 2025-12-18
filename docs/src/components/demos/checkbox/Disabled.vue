<template>
  <div class="demo-container">
    <AxCheckbox v-model="checked" label="禁用未选中" disabled />
    <AxCheckbox v-model="checkedDisabled" label="禁用已选中" disabled />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxCheckbox from '@packages/components/checkbox/src/checkbox.vue'

const checked = ref(false)
const checkedDisabled = ref(true)
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>

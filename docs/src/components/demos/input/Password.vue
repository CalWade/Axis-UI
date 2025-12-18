<template>
  <div class="demo-container">
    <AxInput v-model="password" placeholder="请输入密码" show-password>
      <template #suffixIcon>🔒</template>
    </AxInput>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxInput from '@packages/components/input/src/input.vue'

const password = ref('')
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}
</style>

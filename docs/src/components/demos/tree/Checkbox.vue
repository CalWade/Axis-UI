<template>
  <div class="demo-container">
    <AxTree
      :data="treeData"
      :default-expanded-keys="['1', '2']"
      show-checkbox
      :default-checked-keys="['1-1']"
    />
  </div>
</template>

<script setup lang="ts">
import AxTree from '@packages/components/tree/src/tree.vue'

const treeData = [
  {
    key: '1',
    label: '一级节点 1',
    children: [
      { key: '1-1', label: '二级节点 1-1' },
      { key: '1-2', label: '二级节点 1-2' },
    ],
  },
  {
    key: '2',
    label: '一级节点 2',
    children: [
      { key: '2-1', label: '二级节点 2-1' },
      { key: '2-2', label: '二级节点 2-2', disabled: true },
    ],
  },
]
</script>

<style scoped>
.demo-container {
  max-width: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}
</style>

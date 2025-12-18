<template>
  <div class="demo-container">
    <AxTree :data="treeData" />
  </div>
</template>

<script setup lang="ts">
import AxTree from '@packages/components/tree/src/tree.vue'

const treeData = [
  {
    key: '1',
    label: '一级节点 1',
    children: [
      {
        key: '1-1',
        label: '二级节点 1-1',
        children: [
          { key: '1-1-1', label: '三级节点 1-1-1' },
          { key: '1-1-2', label: '三级节点 1-1-2' },
        ],
      },
      {
        key: '1-2',
        label: '二级节点 1-2',
        children: [
          { key: '1-2-1', label: '三级节点 1-2-1' },
        ],
      },
    ],
  },
  {
    key: '2',
    label: '一级节点 2',
    children: [
      { key: '2-1', label: '二级节点 2-1' },
      { key: '2-2', label: '二级节点 2-2' },
    ],
  },
  {
    key: '3',
    label: '一级节点 3（叶子节点）',
    isLeaf: true,
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

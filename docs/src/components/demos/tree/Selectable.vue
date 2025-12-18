<template>
  <div class="demo-container">
    <p class="demo-tip">选中的节点: {{ selectedKeys }}</p>
    <AxTree
      :data="treeData"
      :default-expanded-keys="['1']"
      selectable
      v-model:selected-keys="selectedKeys"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AxTree from '@packages/components/tree/src/tree.vue'

const selectedKeys = ref<(string | number)[]>([])

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
      { key: '2-2', label: '二级节点 2-2' },
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

.demo-tip {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}
</style>

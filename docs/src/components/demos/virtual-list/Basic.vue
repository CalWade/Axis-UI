<template>
  <div class="demo-container">
    <p class="demo-tip">虚拟列表 - 只渲染可见区域的元素，提升大数据量下的性能</p>
    <AxVirtualList :items="items" :remain="8" :size="40">
      <template #default="{ node }">
        <div class="list-item">
          {{ node.label }}
        </div>
      </template>
    </AxVirtualList>
  </div>
</template>

<script setup lang="ts">
import AxVirtualList from '@packages/components/virtual-list/src/virtual'

// 生成大量数据
const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  label: `列表项 ${index + 1}`,
}))
</script>

<style scoped>
.demo-container {
  max-width: 400px;
}

.demo-tip {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.list-item {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.list-item:hover {
  background: #f5f5f5;
}
</style>

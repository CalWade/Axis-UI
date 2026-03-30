<template>
  <div class="demo-container">
    <p class="demo-tip">动态高度虚拟列表 - 每项高度不同，自动测量</p>
    <AxVirtualList :items="items" :remain="8" :estimatedSize="60">
      <template #default="{ node }">
        <div class="list-item" :style="{ minHeight: node.height + 'px' }">
          <div class="item-title">{{ node.label }}</div>
          <div class="item-content">{{ node.content }}</div>
        </div>
      </template>
    </AxVirtualList>
  </div>
</template>

<script setup lang="ts">
import AxVirtualList from '@packages/components/virtual-list/src/virtual'

// 生成不等高数据
const items = Array.from({ length: 10000 }, (_, index) => {
  const lines = Math.floor(Math.random() * 3) + 1
  return {
    id: index,
    label: `列表项 ${index + 1}`,
    content: '这是一段描述文字。'.repeat(lines),
    height: 40 + lines * 20,
  }
})
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
  padding: 8px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}

.list-item:hover {
  background: #f5f5f5;
}

.item-title {
  font-weight: 600;
  color: #2d1b3d;
  margin-bottom: 4px;
}

.item-content {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}
</style>

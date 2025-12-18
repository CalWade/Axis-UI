<template>
  <div class="demo-container">
    <AxCheckbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </AxCheckbox>
    <div class="checkbox-group">
      <AxCheckbox
        v-for="item in options"
        :key="item"
        v-model="checkedList"
        :label="item"
        @change="handleCheckedChange"
      >
        {{ item }}
      </AxCheckbox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AxCheckbox from '@packages/components/checkbox/src/checkbox.vue'

const options = ['选项A', '选项B', '选项C', '选项D']
const checkedList = ref(['选项A', '选项C'])
const checkAll = ref(false)

const isIndeterminate = computed(() => {
  const length = checkedList.value.length
  return length > 0 && length < options.length
})

const handleCheckAllChange = (val: boolean) => {
  checkedList.value = val ? [...options] : []
}

const handleCheckedChange = () => {
  checkAll.value = checkedList.value.length === options.length
}
</script>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-group {
  display: flex;
  gap: 16px;
  margin-left: 24px;
}
</style>

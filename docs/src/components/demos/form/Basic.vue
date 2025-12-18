<template>
  <div class="demo-container">
    <AxForm :model="form" label-width="80px">
      <AxFormItem label="用户名" prop="username">
        <AxInput v-model="form.username" placeholder="请输入用户名" />
      </AxFormItem>
      <AxFormItem label="密码" prop="password">
        <AxInput v-model="form.password" placeholder="请输入密码" show-password>
          <template #suffixIcon>🔒</template>
        </AxInput>
      </AxFormItem>
      <AxFormItem>
        <AxButton type="primary" @click="handleSubmit">提交</AxButton>
        <AxButton @click="handleReset">重置</AxButton>
      </AxFormItem>
    </AxForm>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AxForm from '@packages/components/form/src/form.vue'
import AxFormItem from '@packages/components/form/src/form-item.vue'
import AxInput from '@packages/components/input/src/input.vue'
import AxButton from '@packages/components/button/src/button.vue'

const form = reactive({
  username: '',
  password: '',
})

const handleSubmit = () => {
  console.log('提交表单:', form)
}

const handleReset = () => {
  form.username = ''
  form.password = ''
}
</script>

<style scoped>
.demo-container {
  max-width: 500px;
}
</style>

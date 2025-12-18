<template>
  <div class="demo-container">
    <AxForm ref="formRef" :model="form" :rules="rules">
      <AxFormItem label="用户名" prop="username">
        <AxInput v-model="form.username" placeholder="请输入用户名" />
      </AxFormItem>
      <AxFormItem label="邮箱" prop="email">
        <AxInput v-model="form.email" placeholder="请输入邮箱" />
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
import { reactive, ref } from 'vue'
import AxForm from '@packages/components/form/src/form.vue'
import AxFormItem from '@packages/components/form/src/form-item.vue'
import AxInput from '@packages/components/input/src/input.vue'
import AxButton from '@packages/components/button/src/button.vue'

const formRef = ref()

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    console.log('验证成功，提交表单:', form)
  } catch (error) {
    console.log('验证失败:', error)
  }
}

const handleReset = () => {
  form.username = ''
  form.email = ''
  form.password = ''
}
</script>

<style scoped>
.demo-container {
  max-width: 500px;
}
</style>

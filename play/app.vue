<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Key, TreeOption } from '../packages/components/tree'
import { FormInstance } from '../packages/components/form'

// ---- Tree：三层静态数据 + 异步加载叶子 ----
function createTreeData(depth = 3, parentKey = ''): TreeOption[] {
  if (!depth) return []
  return Array.from({ length: 3 }, (_, i) => {
    const key = parentKey ? `${parentKey}-${i}` : `${i}`
    return {
      key,
      label: `节点 ${key}`,
      children: createTreeData(depth - 1, key),
    }
  })
}

const treeData = ref(createTreeData())
const selectedKeys = ref<Key[]>([])

// ---- Checkbox ----
const check = ref(true)

// ---- Input ----
const username = ref('hello')

// ---- Form ----
const state = reactive({
  username: '',
  password: '',
})
const formRef = ref<FormInstance>()
const validateForm = () => {
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log('表单验证成功')
    } else {
      console.log('表单验证失败:', fields)
    }
  })
}
</script>

<template>
  <section>
    <h3>Tree（多选 + 勾选）</h3>
    <ax-tree
      :data="treeData"
      v-model:selected-keys="selectedKeys"
      selectable
      multiple
      show-checkbox
      :default-expanded-keys="['0', '1']"
    >
      <template #default="{ node }">{{ node.label }}</template>
    </ax-tree>
    <p>已选中：{{ selectedKeys }}</p>
  </section>

  <section>
    <h3>Checkbox</h3>
    <ax-checkbox v-model="check" :indeterminate="false" label="属性方式传入">
      插槽方式传入
    </ax-checkbox>
  </section>

  <section>
    <h3>Button</h3>
    <ax-button type="danger" round icon-placement="right">
      按钮
      <template #icon>
        <ax-icon>
          <i-codex:checklist></i-codex:checklist>
        </ax-icon>
      </template>
    </ax-button>
  </section>

  <section>
    <h3>Input</h3>
    <ax-input
      v-model="username"
      placeholder="请输入用户名"
      show-password
      clearable
    >
      <template #prepend>前缀</template>
      <template #suffixIcon>
        <ax-icon>
          <i-codex:checklist></i-codex:checklist>
        </ax-icon>
      </template>
      <template #append>后缀</template>
    </ax-input>
  </section>

  <section>
    <h3>Form</h3>
    <ax-form
      ref="formRef"
      :model="state"
      :rules="{
        username: {
          min: 3,
          max: 12,
          message: '长度在3到12个字符',
          trigger: ['blur', 'change'],
        },
      }"
    >
      <ax-form-item
        prop="username"
        :rules="[
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ]"
      >
        <template #label>用户名</template>
        <ax-input v-model="state.username" placeholder="请输入用户名" />
      </ax-form-item>
      <ax-form-item
        prop="password"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
      >
        <template #label>密码</template>
        <ax-input
          v-model="state.password"
          placeholder="请输入密码"
          type="password"
        />
      </ax-form-item>
      <ax-button type="danger" round @click="validateForm">提交</ax-button>
    </ax-form>
  </section>
</template>

<style scoped>
section {
  margin-bottom: 24px;
}
</style>

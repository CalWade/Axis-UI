import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AxForm from '@packages/components/form/src/form.vue'
import AxFormItem from '@packages/components/form/src/form-item.vue'

describe('AxForm', () => {
  // 测试组件是否正常渲染
  it('renders correctly', () => {
    const wrapper = mount(AxForm)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  // 测试插槽内容
  it('renders slot content', () => {
    const wrapper = mount(AxForm, {
      slots: {
        default: '<div class="test-content">表单内容</div>',
      },
    })
    expect(wrapper.find('.test-content').exists()).toBe(true)
  })

  // 测试组件名称
  it('has correct component name', () => {
    const wrapper = mount(AxForm)
    expect(wrapper.vm.$options.name).toBe('AxForm')
  })

  // 测试 model 属性
  it('accepts model prop', () => {
    const model = { username: 'test' }
    const wrapper = mount(AxForm, {
      props: { model },
    })
    expect(wrapper.props('model')).toEqual(model)
  })

  // 测试 rules 属性
  it('accepts rules prop', () => {
    const rules = { username: [{ required: true }] }
    const wrapper = mount(AxForm, {
      props: { rules },
    })
    expect(wrapper.props('rules')).toEqual(rules)
  })

  // 测试 validate 方法暴露
  it('exposes validate method', () => {
    const wrapper = mount(AxForm)
    expect(typeof wrapper.vm.validate).toBe('function')
  })
})

describe('AxFormItem inside AxForm', () => {
  // 测试 FormItem 在 Form 内正确渲染
  it('renders correctly inside Form', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="用户名" prop="username">
            <input v-model="form.username" />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { username: '' } }
      },
    })
    expect(wrapper.findComponent(AxFormItem).exists()).toBe(true)
  })

  // 测试 label 属性
  it('renders label prop correctly', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="用户名" prop="username">
            <input v-model="form.username" />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { username: '' } }
      },
    })
    expect(wrapper.find('.ax-form-item__label').text()).toContain('用户名')
  })

  // 测试插槽内容
  it('renders slot content', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="测试" prop="test">
            <input class="test-input" />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { test: '' } }
      },
    })
    expect(wrapper.find('.test-input').exists()).toBe(true)
  })

  // 测试组件名称
  it('has correct component name', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="测试" prop="test">
            <input />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { test: '' } }
      },
    })
    expect(wrapper.findComponent(AxFormItem).vm.$options.name).toBe('AxFormItem')
  })

  // 测试 prop 属性
  it('accepts prop attribute', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="用户名" prop="username">
            <input />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { username: '' } }
      },
    })
    expect(wrapper.findComponent(AxFormItem).props('prop')).toBe('username')
  })

  // 测试 showMessage 属性
  it('accepts showMessage prop', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="测试" prop="test" :show-message="false">
            <input />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { test: '' } }
      },
    })
    expect(wrapper.findComponent(AxFormItem).props('showMessage')).toBe(false)
  })

  // 测试默认 showMessage 为 true
  it('has default showMessage as true', () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form">
          <AxFormItem label="测试" prop="test">
            <input />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return { form: { test: '' } }
      },
    })
    expect(wrapper.findComponent(AxFormItem).props('showMessage')).toBe(true)
  })
})

describe('AxForm with AxFormItem integration', () => {
  // 测试表单和表单项的集成
  it('form provides context to form-item', async () => {
    const wrapper = mount({
      template: `
        <AxForm :model="form" :rules="rules">
          <AxFormItem label="用户名" prop="username">
            <input v-model="form.username" />
          </AxFormItem>
        </AxForm>
      `,
      components: { AxForm, AxFormItem },
      data() {
        return {
          form: { username: '' },
          rules: {
            username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          },
        }
      },
    })

    expect(wrapper.findComponent(AxForm).exists()).toBe(true)
    expect(wrapper.findComponent(AxFormItem).exists()).toBe(true)
  })
})

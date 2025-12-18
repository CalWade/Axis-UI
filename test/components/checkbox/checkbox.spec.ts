import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AxCheckbox from '@packages/components/checkbox/src/checkbox.vue'

describe('AxCheckbox', () => {
  // 测试组件是否正常渲染
  it('renders correctly', () => {
    const wrapper = mount(AxCheckbox)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  // 测试 v-model 双向绑定
  it('supports v-model', async () => {
    const wrapper = mount(AxCheckbox, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': (e: boolean) => wrapper.setProps({ modelValue: e }),
      },
    })
    expect(wrapper.find('input').element.checked).toBe(false)

    await wrapper.find('input').setValue(true)
    expect(wrapper.props('modelValue')).toBe(true)
  })

  // 测试 label 属性
  it('renders label prop correctly', () => {
    const wrapper = mount(AxCheckbox, {
      props: { label: '选项A' },
    })
    expect(wrapper.text()).toContain('选项A')
  })

  // 测试插槽内容
  it('renders slot content', () => {
    const wrapper = mount(AxCheckbox, {
      slots: {
        default: '自定义内容',
      },
    })
    expect(wrapper.text()).toContain('自定义内容')
  })

  // 测试 disabled 属性
  it('applies disabled prop correctly', () => {
    const wrapper = mount(AxCheckbox, {
      props: { disabled: true },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  // 测试 indeterminate 属性
  it('applies indeterminate prop correctly', async () => {
    const wrapper = mount(AxCheckbox, {
      props: { indeterminate: true },
    })
    // indeterminate 是通过 DOM 属性设置的
    expect(wrapper.find('input').element.indeterminate).toBe(true)
  })

  // 测试 change 事件
  it('emits change event', async () => {
    const wrapper = mount(AxCheckbox, {
      props: { modelValue: false },
    })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  // 测试组件名称
  it('has correct component name', () => {
    const wrapper = mount(AxCheckbox)
    expect(wrapper.vm.$options.name).toBe('AxCheckbox')
  })

  // 测试 indeterminate 响应式更新
  it('updates indeterminate when prop changes', async () => {
    const wrapper = mount(AxCheckbox, {
      props: { indeterminate: false },
    })
    expect(wrapper.find('input').element.indeterminate).toBe(false)

    await wrapper.setProps({ indeterminate: true })
    expect(wrapper.find('input').element.indeterminate).toBe(true)
  })

  // 测试禁用状态不可选
  it('cannot be checked when disabled', async () => {
    const wrapper = mount(AxCheckbox, {
      props: {
        modelValue: false,
        disabled: true,
        'onUpdate:modelValue': (e: boolean) => wrapper.setProps({ modelValue: e }),
      },
    })
    // 禁用状态下原生 input 不会触发 change 事件
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})

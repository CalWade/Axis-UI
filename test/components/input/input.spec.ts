import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AxInput from '@packages/components/input/src/input.vue'

describe('AxInput', () => {
  // 测试组件是否正常渲染
  it('renders correctly', () => {
    const wrapper = mount(AxInput)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // 测试 v-model 双向绑定
  it('supports v-model', async () => {
    const wrapper = mount(AxInput, {
      props: {
        modelValue: 'test',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
      },
    })
    expect(wrapper.find('input').element.value).toBe('test')

    await wrapper.find('input').setValue('new value')
    expect(wrapper.props('modelValue')).toBe('new value')
  })

  // 测试 placeholder 属性
  it('applies placeholder prop correctly', () => {
    const wrapper = mount(AxInput, {
      props: { placeholder: '请输入' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })

  // 测试 disabled 属性
  it('applies disabled prop correctly', () => {
    const wrapper = mount(AxInput, {
      props: { disabled: true },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  // 测试 readonly 属性
  it('applies readonly prop correctly', () => {
    const wrapper = mount(AxInput, {
      props: { readonly: true },
    })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  // 测试 input 事件
  it('emits input event', async () => {
    const wrapper = mount(AxInput)
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')![0]).toEqual(['hello'])
  })

  // 测试 focus 事件
  it('emits focus event', async () => {
    const wrapper = mount(AxInput)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  // 测试 blur 事件
  it('emits blur event', async () => {
    const wrapper = mount(AxInput)
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  // 测试 change 事件
  it('emits change event', async () => {
    const wrapper = mount(AxInput)
    const input = wrapper.find('input')
    await input.setValue('test')
    await input.trigger('change')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  // 测试组件名称
  it('has correct component name', () => {
    const wrapper = mount(AxInput)
    expect(wrapper.vm.$options.name).toBe('AxInput')
  })

  // 测试 type 属性
  it('applies type prop correctly', () => {
    const wrapper = mount(AxInput, {
      props: { type: 'password' },
    })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  // 测试 clearable 属性
  it('accepts clearable prop', () => {
    const wrapper = mount(AxInput, {
      props: {
        modelValue: 'test',
        clearable: true,
      },
    })
    // clearable 属性被正确接收
    expect(wrapper.props('clearable')).toBe(true)
  })

  // 测试响应式更新
  it('updates input value when modelValue changes', async () => {
    const wrapper = mount(AxInput, {
      props: { modelValue: 'initial' },
    })
    expect(wrapper.find('input').element.value).toBe('initial')

    await wrapper.setProps({ modelValue: 'updated' })
    expect(wrapper.find('input').element.value).toBe('updated')
  })
})

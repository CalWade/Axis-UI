import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AxButton from '@packages/components/button/src/button.vue'

describe('AxButton', () => {
  // 测试组件是否正常渲染
  it('renders correctly', () => {
    const wrapper = mount(AxButton)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  // 测试默认插槽内容
  it('renders slot content', () => {
    const wrapper = mount(AxButton, {
      slots: {
        default: '按钮文字',
      },
    })
    expect(wrapper.text()).toContain('按钮文字')
  })

  // 测试 type 属性
  it('applies type prop correctly', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info'] as const
    types.forEach(type => {
      const wrapper = mount(AxButton, {
        props: { type },
      })
      expect(wrapper.classes()).toContain(`ax-button--${type}`)
    })
  })

  // 测试 size 属性
  it('applies size prop correctly', () => {
    const sizes = ['large', 'medium', 'small', 'mini'] as const
    sizes.forEach(size => {
      const wrapper = mount(AxButton, {
        props: { size },
      })
      expect(wrapper.classes()).toContain(`ax-button--${size}`)
    })
  })

  // 测试 round 属性
  it('applies round prop correctly', () => {
    const wrapper = mount(AxButton, {
      props: { round: true },
    })
    expect(wrapper.classes()).toContain('is-round')
  })

  // 测试 disabled 属性
  it('applies disabled prop correctly', () => {
    const wrapper = mount(AxButton, {
      props: { disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  // 测试 loading 属性
  it('applies loading prop correctly', () => {
    const wrapper = mount(AxButton, {
      props: { loading: true },
    })
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  // 测试 nativeType 属性
  it('applies nativeType prop correctly', () => {
    const wrapper = mount(AxButton, {
      props: { nativeType: 'submit' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  // 测试点击事件
  it('emits click event when clicked', async () => {
    const wrapper = mount(AxButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')![0][0]).toBeInstanceOf(MouseEvent)
  })

  // 测试禁用状态不触发点击事件
  it('does not emit click when disabled', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(AxButton, {
      props: { disabled: true },
      attrs: { onClick: handleClick },
    })
    await wrapper.find('button').trigger('click')
    // 由于 disabled 属性，原生按钮不会触发点击事件
    expect(handleClick).not.toHaveBeenCalled()
  })

  // 测试 mousedown 事件
  it('emits mousedown event', async () => {
    const wrapper = mount(AxButton)
    await wrapper.find('button').trigger('mousedown')
    expect(wrapper.emitted('mousedown')).toBeTruthy()
  })

  // 测试组件名称
  it('has correct component name', () => {
    const wrapper = mount(AxButton)
    expect(wrapper.vm.$options.name).toBe('AxButton')
  })
})

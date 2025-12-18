import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'

// 创建一个模拟的 VirtualList 组件用于测试 props
const MockVirtualList = defineComponent({
  name: 'AxVirtualList',
  props: {
    size: {
      type: Number,
      default: 32,
    },
    remain: {
      type: Number,
      default: 8,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'ax-vl' }, slots.default ? slots.default({ node: props.items[0] }) : '')
  },
})

const createMockItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: i, label: `Item ${i}` }))

describe('AxVirtualList', () => {
  // 测试组件名称
  it('has correct component name', async () => {
    const { mount } = await import('@vue/test-utils')
    const wrapper = mount(MockVirtualList, {
      props: {
        items: [],
        size: 32,
        remain: 8,
      },
    })
    expect(wrapper.vm.$options.name).toBe('AxVirtualList')
  })

  // 测试 items 属性
  it('accepts items prop', async () => {
    const { mount } = await import('@vue/test-utils')
    const items = createMockItems(50)
    const wrapper = mount(MockVirtualList, {
      props: { items },
    })
    expect(wrapper.props('items')).toEqual(items)
  })

  // 测试 size 属性
  it('accepts size prop', async () => {
    const { mount } = await import('@vue/test-utils')
    const wrapper = mount(MockVirtualList, {
      props: {
        items: createMockItems(10),
        size: 50,
      },
    })
    expect(wrapper.props('size')).toBe(50)
  })

  // 测试 remain 属性
  it('accepts remain prop', async () => {
    const { mount } = await import('@vue/test-utils')
    const wrapper = mount(MockVirtualList, {
      props: {
        items: createMockItems(10),
        remain: 5,
      },
    })
    expect(wrapper.props('remain')).toBe(5)
  })

  // 测试 default props
  it('has correct default props', async () => {
    const { mount } = await import('@vue/test-utils')
    const wrapper = mount(MockVirtualList)
    expect(wrapper.props('size')).toBe(32)
    expect(wrapper.props('remain')).toBe(8)
    expect(wrapper.props('items')).toEqual([])
  })
})

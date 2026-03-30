import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { virtualListProps } from '@packages/components/virtual-list/src/virtual-list'

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

// ========================================
// 动态高度 Props 定义测试
// ========================================
describe('VirtualList Props Definition', () => {
  it('virtualListProps includes estimatedSize', () => {
    expect(virtualListProps).toHaveProperty('estimatedSize')
  })

  it('estimatedSize defaults to 0', () => {
    expect(virtualListProps.estimatedSize.default).toBe(0)
  })

  it('size defaults to 0 (dynamic mode preparation)', () => {
    expect(virtualListProps.size.default).toBe(0)
  })
})

// ========================================
// 动态高度模式 — 真实组件测试
// ========================================
describe('AxVirtualList Dynamic Height Mode', () => {
  // 动态高度模式下使用 estimatedSize 计算容器和滚动条高度
  it('uses estimatedSize for scroll bar height when size is 0', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(100)
    const wrapper = mount(_VirtualList, {
      props: { items, estimatedSize: 40, remain: 8 },
    })

    // 滚动条高度应为 items.length * estimatedSize
    const scrollBar = wrapper.find('.ax-vl__scroll-bar')
    expect(scrollBar.exists()).toBe(true)
    expect((scrollBar.element as HTMLElement).style.height).toBe(`${100 * 40}px`)
  })

  it('uses size for scroll bar height in fixed mode (backward compat)', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(100)
    const wrapper = mount(_VirtualList, {
      props: { items, size: 32, remain: 8 },
    })

    const scrollBar = wrapper.find('.ax-vl__scroll-bar')
    expect((scrollBar.element as HTMLElement).style.height).toBe(`${100 * 32}px`)
  })

  it('renders visible items in dynamic mode', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(100)
    const wrapper = mount(_VirtualList, {
      props: { items, estimatedSize: 40, remain: 5 },
      slots: {
        default: (slotProps: { node: { label: string } }) => h('div', { class: 'item' }, slotProps.node.label),
      },
    })

    // 应该渲染 remain + buffer 个项（不超过总数）
    const renderedItems = wrapper.findAll('.item')
    expect(renderedItems.length).toBeGreaterThan(0)
    expect(renderedItems.length).toBeLessThanOrEqual(items.length)
  })

  it('wraps items with data-virtual-index in dynamic mode', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(20)
    const wrapper = mount(_VirtualList, {
      props: { items, estimatedSize: 40, remain: 5 },
      slots: {
        default: (slotProps: { node: { label: string } }) => h('div', { class: 'item' }, slotProps.node.label),
      },
    })

    // 动态模式下每个可见项应该有 data-virtual-index 属性
    const indexedItems = wrapper.findAll('[data-virtual-index]')
    expect(indexedItems.length).toBeGreaterThan(0)
    // 第一项的 index 应该是 0
    expect(indexedItems[0].attributes('data-virtual-index')).toBe('0')
  })

  it('does NOT wrap items with data-virtual-index in fixed mode', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(20)
    const wrapper = mount(_VirtualList, {
      props: { items, size: 32, remain: 5 },
      slots: {
        default: (slotProps: { node: { label: string } }) => h('div', { class: 'item' }, slotProps.node.label),
      },
    })

    // 固定模式下不应有 data-virtual-index wrapper
    const indexedItems = wrapper.findAll('[data-virtual-index]')
    expect(indexedItems.length).toBe(0)
  })

  it('sets container height based on remain * estimatedSize', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(50)
    const wrapper = mount(_VirtualList, {
      props: { items, estimatedSize: 60, remain: 10 },
    })

    // 容器高度 = remain * estimatedSize = 10 * 60 = 600px
    const container = wrapper.find('.ax-vl')
    expect((container.element as HTMLElement).style.height).toBe('600px')
  })

  it('sets container height based on remain * size in fixed mode', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(50)
    const wrapper = mount(_VirtualList, {
      props: { items, size: 32, remain: 10 },
    })

    // 容器高度 = remain * size = 10 * 32 = 320px
    const container = wrapper.find('.ax-vl')
    expect((container.element as HTMLElement).style.height).toBe('320px')
  })

  it('cleans up stale cache entries when items shrink', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(50)
    const wrapper = mount(_VirtualList, {
      props: { items, estimatedSize: 40, remain: 5 },
    })

    // 滚动条高度应该是 50 * 40 = 2000
    const scrollBar = wrapper.find('.ax-vl__scroll-bar')
    expect((scrollBar.element as HTMLElement).style.height).toBe('2000px')

    // 缩小 items
    await wrapper.setProps({ items: createMockItems(20) })

    // 滚动条高度应该更新为 20 * 40 = 800
    expect((scrollBar.element as HTMLElement).style.height).toBe('800px')
  })

  it('falls back to 32 when both size and estimatedSize are 0', async () => {
    const { mount } = await import('@vue/test-utils')
    const _VirtualList = (await import('@packages/components/virtual-list/src/virtual')).default

    const items = createMockItems(10)
    const wrapper = mount(_VirtualList, {
      props: { items, remain: 5 },
    })

    // 默认 fallback: 5 * 32 = 160
    const container = wrapper.find('.ax-vl')
    expect((container.element as HTMLElement).style.height).toBe('160px')

    // 滚动条高度: 10 * 32 = 320
    const scrollBar = wrapper.find('.ax-vl__scroll-bar')
    expect((scrollBar.element as HTMLElement).style.height).toBe('320px')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import AxTree from '@packages/components/tree/src/tree.vue'
import AxTreeNode from '@packages/components/tree/src/treeNode.vue'
import AxCheckbox from '@packages/components/checkbox/src/checkbox.vue'

// VirtualList 在测试环境中没有真实 DOM 尺寸，无法计算可视区域。
// 用 stub 替代：直接渲染所有 items，不做虚拟滚动。
const VirtualListStub = defineComponent({
  name: 'AxVirtualList',
  props: { items: { type: Array, default: () => [] }, size: Number, remain: Number },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { class: 'ax-vl' },
        props.items.map((item: unknown) => slots.default?.({ node: item }))
      )
  },
})

const mockTreeData = [
  {
    key: '1',
    label: '节点 1',
    children: [
      { key: '1-1', label: '子节点 1-1' },
      { key: '1-2', label: '子节点 1-2' },
    ],
  },
  {
    key: '2',
    label: '节点 2',
    children: [{ key: '2-1', label: '子节点 2-1' }],
  },
  {
    key: '3',
    label: '节点 3',
    isLeaf: true,
  },
]

/**
 * 挂载 Tree 组件，并正确处理 stubs：
 * - VirtualList → 用 stub（跳过虚拟滚动，直接渲染所有项）
 * - TreeNode / Checkbox → 用真实组件（需要测试行为）
 * - 图标 → 用 stub（不需要测试）
 * - 全局 setup 中的 stub 需要通过 `false` 显式覆盖
 */
const mountTree = (props = {}) => {
  return mount(AxTree, {
    props: { data: mockTreeData, ...props },
    global: {
      stubs: {
        // 覆盖全局 stub，使用真实组件
        'ax-tree-node': false,
        'AxTreeNode': false,
        'ax-checkbox': false,
        'AxCheckbox': false,
        // VirtualList 使用 stub（跳过 DOM 尺寸依赖）
        'ax-virtual-list': VirtualListStub,
        'AxVirtualList': VirtualListStub,
        // 图标使用 stub
        'ax-icon': { template: '<span><slot/></span>' },
        'AxIcon': { template: '<span><slot/></span>' },
        'AxTreeNodeContent': {
          props: ['node'],
          template: '<span>{{ node.label }}</span>',
        },
        'i-codex:direction-down-right': true,
        'i-codex:loader': true,
      },
      components: {
        'ax-virtual-list': VirtualListStub,
        'ax-tree-node': AxTreeNode,
        'ax-checkbox': AxCheckbox,
      },
    },
  })
}

describe('AxTree', () => {
  // ========================================
  // 基础渲染测试
  // ========================================

  it('renders correctly', () => {
    const wrapper = mount(AxTree, { props: { data: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AxTree, { props: { data: [] } })
    expect(wrapper.vm.$options.name).toBe('AxTree')
  })

  it('has correct default props', () => {
    const wrapper = mount(AxTree, { props: { data: [] } })
    expect(wrapper.props('keyField')).toBe('key')
    expect(wrapper.props('labelField')).toBe('label')
    expect(wrapper.props('childrenField')).toBe('children')
    expect(wrapper.props('selectable')).toBe(true)
    expect(wrapper.props('multiple')).toBe(false)
    expect(wrapper.props('showCheckbox')).toBe(false)
  })

  it('handles empty data', () => {
    const wrapper = mount(AxTree, { props: { data: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  // ========================================
  // 展开 / 折叠行为测试
  // ========================================

  it('只渲染根节点，子节点默认不可见', () => {
    const wrapper = mountTree()
    const text = wrapper.text()
    expect(text).toContain('节点 1')
    expect(text).toContain('节点 2')
    expect(text).toContain('节点 3')
    expect(text).not.toContain('子节点 1-1')
    expect(text).not.toContain('子节点 1-2')
  })

  it('通过 defaultExpandedKeys 展开指定节点', () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['1'] })
    const text = wrapper.text()
    expect(text).toContain('子节点 1-1')
    expect(text).toContain('子节点 1-2')
    expect(text).not.toContain('子节点 2-1')
  })

  it('点击展开图标后显示子节点', async () => {
    const wrapper = mountTree()
    const expandIcons = wrapper.findAll('.ax-tree-node__expand-icon')
    expect(expandIcons.length).toBeGreaterThan(0)

    await expandIcons[0].trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('子节点 1-1')
    expect(wrapper.text()).toContain('子节点 1-2')
  })

  it('再次点击展开图标后折叠子节点', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['1'] })
    expect(wrapper.text()).toContain('子节点 1-1')

    const expandIcons = wrapper.findAll('.ax-tree-node__expand-icon')
    await expandIcons[0].trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('子节点 1-1')
  })

  it('叶子节点的展开图标有 is-leaf 类名', () => {
    const wrapper = mountTree()
    const nodes = wrapper.findAll('.ax-tree-node')
    expect(nodes.length).toBeGreaterThan(0)
    const leafNode = nodes[nodes.length - 1]
    const icon = leafNode.find('.ax-tree-node__expand-icon')
    expect(icon.classes()).toContain('is-leaf')
  })

  // ========================================
  // 选中行为测试
  // ========================================

  it('点击节点触发 update:selectedKeys', async () => {
    const wrapper = mountTree({ selectable: true })
    const labels = wrapper.findAll('.ax-tree-node__label')
    expect(labels.length).toBeGreaterThan(0)

    await labels[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeTruthy()
    expect(wrapper.emitted('update:selectedKeys')![0][0]).toEqual(['1'])
  })

  it('多选模式下可选中多个节点', async () => {
    const wrapper = mountTree({ selectable: true, multiple: true })
    const labels = wrapper.findAll('.ax-tree-node__label')

    await labels[0].trigger('click')
    // 模拟外部 v-model 同步：将第一次 emit 的 keys 回传给组件
    const firstKeys = wrapper.emitted('update:selectedKeys')![0][0] as string[]
    await wrapper.setProps({ selectedKeys: firstKeys })

    await labels[1].trigger('click')

    const emitted = wrapper.emitted('update:selectedKeys')!
    expect(emitted[1][0]).toEqual(['1', '2'])
  })

  it('禁用节点不可选中', async () => {
    const disabledData = [
      { key: '1', label: '禁用节点', disabled: true },
      { key: '2', label: '正常节点' },
    ]
    const wrapper = mountTree({ data: disabledData, selectable: true })
    const labels = wrapper.findAll('.ax-tree-node__label')
    await labels[0].trigger('click')

    expect(wrapper.emitted('update:selectedKeys')).toBeFalsy()
  })

  // ========================================
  // Checkbox 级联选中测试
  // ========================================

  it('勾选父节点后子节点全部选中', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(2)

    await checkboxes[0].setValue(true)
    await wrapper.vm.$nextTick()

    const updated = wrapper.findAll('input[type="checkbox"]')
    expect((updated[0].element as HTMLInputElement).checked).toBe(true)
    expect((updated[1].element as HTMLInputElement).checked).toBe(true)
    expect((updated[2].element as HTMLInputElement).checked).toBe(true)
  })

  it('取消勾选父节点后子节点全部取消', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
      defaultCheckedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(false)
    await wrapper.vm.$nextTick()

    const updated = wrapper.findAll('input[type="checkbox"]')
    expect((updated[1].element as HTMLInputElement).checked).toBe(false)
    expect((updated[2].element as HTMLInputElement).checked).toBe(false)
  })

  it('部分子节点选中时父节点半选', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true)
    await wrapper.vm.$nextTick()

    const parent = wrapper.findAll('input[type="checkbox"]')[0].element as HTMLInputElement
    expect(parent.indeterminate).toBe(true)
    expect(parent.checked).toBe(false)
  })

  it('所有子节点选中后父节点自动全选', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true)
    await wrapper.vm.$nextTick()
    // 重新查询，因为 DOM 可能已更新
    const cb2 = wrapper.findAll('input[type="checkbox"]')
    await cb2[2].setValue(true)
    await wrapper.vm.$nextTick()

    const parent = wrapper.findAll('input[type="checkbox"]')[0].element as HTMLInputElement
    expect(parent.checked).toBe(true)
    expect(parent.indeterminate).toBe(false)
  })

  // ========================================
  // 异步加载测试
  // ========================================

  it('调用 onLoad 异步加载子节点', async () => {
    const asyncData = [{ key: '1', label: '异步节点', isLeaf: false }]
    const onLoad = vi.fn().mockResolvedValue([
      { key: '1-1', label: '异步子节点', isLeaf: true },
    ])

    const wrapper = mountTree({ data: asyncData, onLoad })
    const expandIcons = wrapper.findAll('.ax-tree-node__expand-icon')
    expect(expandIcons.length).toBeGreaterThan(0)

    await expandIcons[0].trigger('click')
    expect(onLoad).toHaveBeenCalledTimes(1)
    expect(onLoad).toHaveBeenCalledWith(asyncData[0])
  })

  // ========================================
  // 自定义字段映射测试
  // ========================================

  it('支持自定义 keyField 和 labelField', () => {
    const customData = [{ id: 'a', name: '自定义节点', children: [] }]
    const wrapper = mountTree({
      data: customData,
      keyField: 'id',
      labelField: 'name',
    })
    expect(wrapper.text()).toContain('自定义节点')
  })
})

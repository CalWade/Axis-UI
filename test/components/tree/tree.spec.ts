import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AxTree from '@packages/components/tree/src/tree.vue'
import AxTreeNode from '@packages/components/tree/src/treeNode.vue'
import AxVirtualList from '@packages/components/virtual-list/src/virtual'
import AxCheckbox from '@packages/components/checkbox/src/checkbox.vue'

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
    children: [
      { key: '2-1', label: '子节点 2-1' },
    ],
  },
  {
    key: '3',
    label: '节点 3',
    isLeaf: true,
  },
]

// 挂载 Tree 时注册真实子组件（覆盖全局 stub）
const mountTree = (props = {}) => {
  return mount(AxTree, {
    props: { data: mockTreeData, ...props },
    global: {
      components: {
        'ax-tree-node': AxTreeNode,
        'ax-virtual-list': AxVirtualList,
        'ax-checkbox': AxCheckbox,
      },
      stubs: {
        // 只 stub 图标，其他用真实组件
        'ax-icon': true,
        'i-codex:direction-down-right': true,
        'i-codex:loader': true,
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
    const labels = wrapper.findAll('.ax-tree-node__label')
    const texts = labels.map(l => l.text())
    // 只有根节点可见
    expect(texts).toContain('节点 1')
    expect(texts).toContain('节点 2')
    expect(texts).toContain('节点 3')
    // 子节点不可见
    expect(texts).not.toContain('子节点 1-1')
    expect(texts).not.toContain('子节点 1-2')
  })

  it('通过 defaultExpandedKeys 展开指定节点', () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['1'] })
    const labels = wrapper.findAll('.ax-tree-node__label')
    const texts = labels.map(l => l.text())
    // 节点1 的子节点应该可见
    expect(texts).toContain('子节点 1-1')
    expect(texts).toContain('子节点 1-2')
    // 节点2 的子节点不可见
    expect(texts).not.toContain('子节点 2-1')
  })

  it('点击展开图标后显示子节点', async () => {
    const wrapper = mountTree()
    // 找到第一个展开图标（节点1）并点击
    const expandIcons = wrapper.findAll('.ax-tree-node__expand-icon')
    await expandIcons[0].trigger('click')
    await wrapper.vm.$nextTick()

    const labels = wrapper.findAll('.ax-tree-node__label')
    const texts = labels.map(l => l.text())
    expect(texts).toContain('子节点 1-1')
    expect(texts).toContain('子节点 1-2')
  })

  it('再次点击展开图标后折叠子节点', async () => {
    const wrapper = mountTree({ defaultExpandedKeys: ['1'] })
    // 节点1 已展开，点击折叠
    const expandIcons = wrapper.findAll('.ax-tree-node__expand-icon')
    await expandIcons[0].trigger('click')
    await wrapper.vm.$nextTick()

    const labels = wrapper.findAll('.ax-tree-node__label')
    const texts = labels.map(l => l.text())
    expect(texts).not.toContain('子节点 1-1')
    expect(texts).not.toContain('子节点 1-2')
  })

  it('叶子节点的展开图标有 is-leaf 类名', () => {
    const wrapper = mountTree()
    const nodes = wrapper.findAll('.ax-tree-node')
    const leafNode = nodes[nodes.length - 1] // 节点3 是叶子节点
    const icon = leafNode.find('.ax-tree-node__expand-icon')
    expect(icon.classes()).toContain('is-leaf')
  })

  // ========================================
  // 选中行为测试
  // ========================================

  it('点击节点触发 update:selectedKeys', async () => {
    const wrapper = mountTree({ selectable: true })
    // 点击第一个节点的 label
    const labels = wrapper.findAll('.ax-tree-node__label')
    await labels[0].trigger('click')

    expect(wrapper.emitted('update:selectedKeys')).toBeTruthy()
    expect(wrapper.emitted('update:selectedKeys')![0][0]).toEqual(['1'])
  })

  it('多选模式下可选中多个节点', async () => {
    const wrapper = mountTree({ selectable: true, multiple: true })
    const labels = wrapper.findAll('.ax-tree-node__label')

    await labels[0].trigger('click') // 选中节点1
    await labels[1].trigger('click') // 选中节点2

    const emitted = wrapper.emitted('update:selectedKeys')!
    // 第二次 emit 应包含两个 key
    expect(emitted[1][0]).toEqual(['1', '2'])
  })

  it('禁用节点不可选中', async () => {
    const disabledData = [
      { key: '1', label: '节点 1', disabled: true },
      { key: '2', label: '节点 2' },
    ]
    const wrapper = mountTree({ data: disabledData, selectable: true })
    const labels = wrapper.findAll('.ax-tree-node__label')

    await labels[0].trigger('click') // 点击禁用节点

    // 不应该触发选中事件
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

    // 找到节点1 的 checkbox 并勾选
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    await wrapper.vm.$nextTick()

    // 子节点的 checkbox 也应该被选中
    const allCheckboxes = wrapper.findAll('input[type="checkbox"]')
    // 节点1、子节点1-1、子节点1-2 的 checkbox 都应该选中
    expect((allCheckboxes[0].element as HTMLInputElement).checked).toBe(true)
    expect((allCheckboxes[1].element as HTMLInputElement).checked).toBe(true)
    expect((allCheckboxes[2].element as HTMLInputElement).checked).toBe(true)
  })

  it('取消勾选父节点后子节点全部取消', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
      defaultCheckedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    // 取消节点1 的 checkbox
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setValue(false)
    await wrapper.vm.$nextTick()

    // 子节点也应该取消
    const allCheckboxes = wrapper.findAll('input[type="checkbox"]')
    expect((allCheckboxes[1].element as HTMLInputElement).checked).toBe(false)
    expect((allCheckboxes[2].element as HTMLInputElement).checked).toBe(false)
  })

  it('部分子节点选中时父节点半选', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    // 只勾选子节点1-1
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[1].setValue(true) // 子节点1-1
    await wrapper.vm.$nextTick()

    // 父节点（节点1）应该是半选状态
    const parentCheckbox = checkboxes[0].element as HTMLInputElement
    expect(parentCheckbox.indeterminate).toBe(true)
    expect(parentCheckbox.checked).toBe(false)
  })

  it('所有子节点选中后父节点自动全选', async () => {
    const wrapper = mountTree({
      showCheckbox: true,
      defaultExpandedKeys: ['1'],
    })
    await wrapper.vm.$nextTick()

    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    // 逐个勾选所有子节点
    await checkboxes[1].setValue(true) // 子节点1-1
    await wrapper.vm.$nextTick()
    await checkboxes[2].setValue(true) // 子节点1-2
    await wrapper.vm.$nextTick()

    // 父节点应该自动变为全选
    const parentCheckbox = checkboxes[0].element as HTMLInputElement
    expect(parentCheckbox.checked).toBe(true)
    expect(parentCheckbox.indeterminate).toBe(false)
  })

  // ========================================
  // 异步加载测试
  // ========================================

  it('调用 onLoad 异步加载子节点', async () => {
    const asyncData = [
      { key: '1', label: '异步节点', isLeaf: false },
    ]
    const onLoad = vi.fn().mockResolvedValue([
      { key: '1-1', label: '异步子节点 1', isLeaf: true },
      { key: '1-2', label: '异步子节点 2', isLeaf: true },
    ])

    const wrapper = mountTree({ data: asyncData, onLoad })
    // 点击展开
    const expandIcon = wrapper.find('.ax-tree-node__expand-icon')
    await expandIcon.trigger('click')

    // onLoad 应该被调用
    expect(onLoad).toHaveBeenCalledTimes(1)
    expect(onLoad).toHaveBeenCalledWith(asyncData[0])
  })

  // ========================================
  // 自定义字段映射测试
  // ========================================

  it('支持自定义 keyField 和 labelField', () => {
    const customData = [
      { id: 'a', name: '自定义节点', children: [] },
    ]
    const wrapper = mountTree({
      data: customData,
      keyField: 'id',
      labelField: 'name',
    })
    const label = wrapper.find('.ax-tree-node__label')
    expect(label.text()).toBe('自定义节点')
  })
})

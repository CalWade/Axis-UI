import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AxTree from '@packages/components/tree/src/tree.vue'

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

describe('AxTree', () => {
  // 测试组件是否正常渲染
  it('renders correctly', () => {
    const wrapper = mount(AxTree, {
      props: { data: [] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  // 测试组件名称
  it('has correct component name', () => {
    const wrapper = mount(AxTree, {
      props: { data: [] },
    })
    expect(wrapper.vm.$options.name).toBe('AxTree')
  })

  // 测试 data 属性接收
  it('accepts data prop', () => {
    const wrapper = mount(AxTree, {
      props: { data: mockTreeData },
    })
    expect(wrapper.props('data')).toEqual(mockTreeData)
  })

  // 测试 defaultExpandedKeys 属性
  it('accepts defaultExpandedKeys prop', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: mockTreeData,
        defaultExpandedKeys: ['1'],
      },
    })
    expect(wrapper.props('defaultExpandedKeys')).toEqual(['1'])
  })

  // 测试 keyField 属性
  it('accepts custom keyField', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: [],
        keyField: 'id',
      },
    })
    expect(wrapper.props('keyField')).toBe('id')
  })

  // 测试 labelField 属性
  it('accepts custom labelField', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: [],
        labelField: 'name',
      },
    })
    expect(wrapper.props('labelField')).toBe('name')
  })

  // 测试 default props
  it('has correct default props', () => {
    const wrapper = mount(AxTree, {
      props: { data: [] },
    })
    expect(wrapper.props('keyField')).toBe('key')
    expect(wrapper.props('labelField')).toBe('label')
    expect(wrapper.props('childrenField')).toBe('children')
    expect(wrapper.props('selectable')).toBe(true)
    expect(wrapper.props('multiple')).toBe(false)
    expect(wrapper.props('showCheckbox')).toBe(false)
  })

  // 测试 showCheckbox 属性
  it('accepts showCheckbox prop', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: mockTreeData,
        showCheckbox: true,
      },
    })
    expect(wrapper.props('showCheckbox')).toBe(true)
  })

  // 测试 defaultCheckedKeys 属性
  it('accepts defaultCheckedKeys prop', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: mockTreeData,
        showCheckbox: true,
        defaultCheckedKeys: ['1'],
      },
    })
    expect(wrapper.props('defaultCheckedKeys')).toEqual(['1'])
  })

  // 测试空数据
  it('handles empty data', () => {
    const wrapper = mount(AxTree, {
      props: { data: [] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  // 测试 selectable 属性
  it('accepts selectable prop', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: mockTreeData,
        selectable: false,
      },
    })
    expect(wrapper.props('selectable')).toBe(false)
  })

  // 测试 multiple 属性
  it('accepts multiple prop', () => {
    const wrapper = mount(AxTree, {
      props: {
        data: mockTreeData,
        multiple: true,
      },
    })
    expect(wrapper.props('multiple')).toBe(true)
  })
})

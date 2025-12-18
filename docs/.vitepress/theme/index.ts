import DefaultTheme from 'vitepress/theme'
import './style.css'
// 导入组件库样式
import '@packages/theme-chalk/src/index.scss'
import Demo from './components/Demo.vue'

// 导入需要全局注册的组件
import AxVirtualList from '@packages/components/virtual-list'
import AxTreeNode from '@packages/components/tree/src/treeNode.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
    // 全局注册组件以支持 Tree 等复合组件
    app.component('AxVirtualList', AxVirtualList)
    app.component('ax-virtual-list', AxVirtualList)
    app.component('AxTreeNode', AxTreeNode)
    app.component('ax-tree-node', AxTreeNode)
  },
}

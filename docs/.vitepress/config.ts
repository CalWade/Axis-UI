import { defineConfig } from 'vitepress'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  // 站点元数据
  title: 'Axis-UI',
  description: '基于 Vue 3 + TypeScript 的现代化组件库',
  lang: 'zh-CN',
  base: '/Axis-UI/',
  // 目录设置
  srcDir: './src',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: 'API', link: '/api/' },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: 'TDD 开发流程', link: '/guide/tdd-workflow' },
            { text: '组件开发规范', link: '/guide/component-guidelines' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件概览',
          items: [{ text: '组件列表', link: '/components/' }],
        },
        {
          text: '基础组件',
          items: [
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Button 按钮', link: '/components/button' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Form 表单', link: '/components/form' },
          ],
        },
        {
          text: '数据组件',
          items: [
            { text: 'Tree 树形控件', link: '/components/tree' },
            { text: 'VirtualList 虚拟列表', link: '/components/virtual-list' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [{ text: 'API 概览', link: '/api/' }],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Calvinvv/axis-ui' },
    ],

    // 页脚
    footer: {
      message: '基于 MIT 协议开源',
      copyright: 'Copyright © 2025 Axis-UI',
    },

    // 搜索
    search: {
      provider: 'local',
    },
  },

  // Markdown 配置
  markdown: {
    theme: 'github-dark',
    lineNumbers: true,
  },

  // Vite 配置：为 demos 提供 monorepo 内部导入别名
  vite: {
    plugins: [
      vueJsx(),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
      Components({
        dirs: ['.vitepress/theme/components'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          IconsResolver({
            prefix: 'i',
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        '@packages': path.resolve(__dirname, '../../packages'),
      },
    },
  },
})

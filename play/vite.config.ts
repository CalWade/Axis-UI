import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { AxisUIResolver } from '../packages/components/resolver'

// {{ AURA-X: Modify - 仅配置 components 入口 alias，其他包由 workspace 自然解析. Approval: 寸止 }}
export default defineConfig({
  plugins: [
    vue(),
    DefineOptions(),
    vueJsx(),
    Icons({
      autoInstall: true, // 自动安装需要的图标库 (建议开启)
      compiler: 'vue3', // 指定编译器，默认为 'vue3'
    }),
    Components({
      dts: false,
      resolvers: [
        AxisUIResolver(),
        // 自动注册图标组件
        IconsResolver({
          prefix: 'i', // 自动引入的图标组件前缀，默认为 'i'
        }),
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^axis-ui\/(.*)$/,
        replacement: resolve(__dirname, '../packages/components/$1/index.ts'),
      },
      {
        find: /^axis-ui$/,
        replacement: resolve(__dirname, '../packages/components/index.ts'),
      },
      {
        find: '@axis-ui/utils',
        replacement: resolve(__dirname, '../packages/utils/index.ts'),
      },
      {
        find: /^@axis-ui\/theme-chalk\/dist\/(.*)\.css$/,
        replacement: resolve(__dirname, '../packages/theme-chalk/src/$1.scss'),
      },
      {
        find: '@axis-ui/theme-chalk',
        replacement: resolve(__dirname, '../packages/theme-chalk/src/index.scss'),
      },
    ],
  },
})

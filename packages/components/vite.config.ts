import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isUmd = mode === 'umd'

  return {
    plugins: [
      vue(),
      // 仅在 ESM 模式下生成类型定义
      !isUmd && dts({
        tsconfigPath: '../../tsconfig.json',
        outDir: 'dist/types',
        entryRoot: '.', // 源码根目录
        cleanVueFileName: true,
        include: ['**/*.ts', '**/*.vue'],
        exclude: ['node_modules', 'dist', '**/*.spec.ts', 'vite.config.ts']
      })
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: !isUmd, // UMD 构建时不清空
      lib: {
        entry: isUmd
          ? resolve(__dirname, 'index.ts')
          : {
              index: resolve(__dirname, 'index.ts'),
              resolver: resolve(__dirname, 'resolver.ts')
            },
        name: 'AxisUI',
        // ESM: 保留文件名; UMD: 固定文件名
        fileName: (format) => format === 'es' ? '[name].js' : 'index.umd.js',
        formats: isUmd ? ['umd'] : ['es']
      },
      rollupOptions: {
        // 确保外部依赖不打包
        external: isUmd
          ? ['vue']
          : ['vue', '@axis-ui/utils', '@axis-ui/theme-chalk'],
        output: {
          exports: 'named',
          globals: {
            vue: 'Vue'
          },
          // ESM 模式开启 preserveModules 以支持 Tree-shaking
          preserveModules: !isUmd,
          preserveModulesRoot: __dirname,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'style.css'
            return assetInfo.name as string
          }
        }
      }
    }
  }
})

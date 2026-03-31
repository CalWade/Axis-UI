import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

/**
 * 构建时将 SCSS 源文件路径替换为编译后的 CSS 路径
 * @axis-ui/theme-chalk/src/button.scss → @axis-ui/theme-chalk/dist/button.css
 * 这样用户无需安装 sass，直接使用编译后的 CSS
 */
function scssToDistCss(): Plugin {
  return {
    name: 'axis-ui-scss-to-dist-css',
    enforce: 'pre',
    resolveId(source) {
      if (source.includes('@axis-ui/theme-chalk/src/')) {
        const replaced = source
          .replace('/src/', '/dist/')
          .replace('.scss', '.css')
        return { id: replaced, external: true }
      }
      return null
    },
  }
}

export default defineConfig(({ mode }) => {
  const isUmd = mode === 'umd'

  return {
    plugins: [
      vue(),
      !isUmd && scssToDistCss(),
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
              resolver: resolve(__dirname, 'resolver.ts'),
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

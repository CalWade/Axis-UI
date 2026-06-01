import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: '../../tsconfig.json',
      outDir: 'dist/types',
      entryRoot: '.',
      // 只为本包源码生成声明，防止 vite.config.d.ts 等混入发布产物
      // index.ts 会继续导出主题与颜色工具；声明入口必须覆盖所有源码，
      // 否则发布包中的 index.d.ts 会引用并不存在的声明文件。
      include: ['*.ts'],
      exclude: ['vite.config.ts', 'dist', 'node_modules'],
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      fileName: () => 'index.mjs',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
})

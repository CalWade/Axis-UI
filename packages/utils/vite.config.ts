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
      include: ['index.ts', 'create.ts', 'with-install.ts'],
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

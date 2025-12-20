import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: '../../tsconfig.json',
      outDir: 'dist/types',
      entryRoot: '.',
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'AxisUtils',
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.umd.js',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue']
    }
  }
})

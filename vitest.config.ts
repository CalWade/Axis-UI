import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  // vueJsx 必须显式配置：esbuild 对 .tsx 的默认产物是 React JSX，
  // 缺了它 virtual.tsx 这类 TSX 组件在运行时会抛 "React is not defined"
  plugins: [vue(), vueJsx()],
  test: {
    // 启用类似Jest的测试API
    globals: true,
    // 模拟DOM环境
    environment: 'happy-dom',
    // 支持Vue文件
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.output'],
    // 测试设置文件
    setupFiles: ['./test/setup/index.ts'],
    // 测试覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'packages/**/dist/**',
        'play/**',
        'docs/**',
        '**/*.d.ts',
        '**/*.config.*',
        'test/**',
        'coverage/**',
        '**/*.scss',
        '**/*.css',
      ],
      // 覆盖率阈值：按当前真实水平设定门槛，随测试补齐逐步上调
      // 注意：Vitest 的阈值直接写在 thresholds 下，嵌套 global 是 Jest 语法（会被当作 glob 忽略）
      thresholds: {
        statements: 78,
        branches: 48,
        functions: 72,
        lines: 78,
      },
    },
    // 快照测试配置
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: false,
    },
    // 测试超时时间
    testTimeout: 10000,
    // 钩子超时时间
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname),
      '@test': resolve(__dirname, './test'),
      '@packages': resolve(__dirname, './packages'),
      '@docs': resolve(__dirname, './docs'),
      'axis-ui': resolve(__dirname, './packages/components/index.ts'),
      '@axis-ui/utils': resolve(__dirname, './packages/utils/index.ts'),
      '@axis-ui/theme-chalk/src': resolve(
        __dirname,
        './packages/theme-chalk/src'
      ),
      '@axis-ui/theme-chalk': resolve(__dirname, './packages/theme-chalk'),
    },
  },
})

# Axis-UI

<p align="center">
  <strong>一个现代化、轻量级的 Vue 3 组件库</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@axis-ui/components"><img src="https://img.shields.io/npm/v/@axis-ui/components.svg" alt="npm version"></a>
  <a href="https://github.com/Calvinvv/Axis-UI/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@axis-ui/components.svg" alt="license"></a>
  <a href="https://github.com/Calvinvv/Axis-UI"><img src="https://img.shields.io/github/stars/Calvinvv/Axis-UI?style=social" alt="GitHub stars"></a>
</p>

## ✨ 特性

- 🚀 **现代化架构**: 基于 Vue 3 + TypeScript + Vite 构建
- 📦 **双模式构建**: 同时支持 ESM (Tree-shaking) 和 UMD 格式
- 🎨 **类型友好**: 提供完整的 TypeScript 类型定义
- 🔧 **按需引入**: 支持 Resolver 自动按需加载
- � **工程化规范**: 采用 Monorepo 架构，使用 Changesets 管理版本
- 🧪 **质量保障**: 完善的测试流程（单元测试 + 冒烟测试）

## 📦 安装

```bash
# 使用 pnpm
pnpm add @axis-ui/components

# 使用 npm
npm install @axis-ui/components

# 使用 yarn
yarn add @axis-ui/components
```

## 🔨 使用

### 全量引入

```typescript
import { createApp } from 'vue'
import AxisUI from '@axis-ui/components'
import '@axis-ui/components/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(AxisUI)
app.mount('#app')
```

### 按需引入 (推荐)

借助 `unplugin-vue-components` 和 `AxisUIResolver`，您可以实现自动按需引入。

**vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { AxisUIResolver } from '@axis-ui/components/resolver'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AxisUIResolver()],
    }),
  ],
})
```

### 手动按需引入

```typescript
import { AxIcon } from '@axis-ui/components'
// 样式文件会自动按需加载（如果使用了 Resolver），否则需手动引入
// import '@axis-ui/components/dist/style.css' 
```

## 📚 组件列表

当前已实现的组件：

- **Button** - 按钮组件
- **Checkbox** - 复选框组件
- **Form** - 表单组件
- **Icon** - 图标组件
- **Input** - 输入框组件
- **Tree** - 树形控件
- **VirtualList** - 虚拟列表

更多组件正在开发中...

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Calvinvv/Axis-UI)
- [更新日志](./CHANGELOG.md)
- [问题反馈](https://github.com/Calvinvv/Axis-UI/issues)

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

[MIT](./LICENSE) © 韦贺文

## 💖 致谢

感谢所有为这个项目做出贡献的开发者！

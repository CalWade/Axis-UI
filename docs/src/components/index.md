# 组件

Axis-UI 提供了丰富的 Vue 3 组件，支持 TypeScript 和完整的类型定义。

## 📦 组件列表

### 基础组件

| 组件 | 说明 |
| --- | --- |
| [Icon 图标](./icon) | 基于字体的图标组件 |
| [Button 按钮](./button) | 常用的操作按钮 |

### 表单组件

| 组件 | 说明 |
| --- | --- |
| [Input 输入框](./input) | 文本输入组件 |
| [Checkbox 复选框](./checkbox) | 多选组件 |
| [Form 表单](./form) | 表单验证组件 |

### 数据组件

| 组件 | 说明 |
| --- | --- |
| [Tree 树形控件](./tree) | 层级结构展示 |
| [VirtualList 虚拟列表](./virtual-list) | 大数据虚拟滚动 |

## 🚀 快速开始

### 安装

```bash
npm install @axis-ui/components
```

### 全量引入

```typescript
import { createApp } from 'vue'
import AxisUI from '@axis-ui/components'
import '@axis-ui/theme-chalk/src/index.scss'

const app = createApp(App)
app.use(AxisUI)
```

### 按需引入

```typescript
import { AxButton, AxInput, AxForm } from '@axis-ui/components'

// 在组件中使用
<AxButton type="primary">按钮</AxButton>
<AxInput v-model="value" placeholder="请输入" />
```

## 🎨 主题定制

所有组件都支持 CSS 变量定制：

```css
:root {
  --ax-color-primary: #3b82f6;
  --ax-color-success: #10b981;
  --ax-color-warning: #f59e0b;
  --ax-color-danger: #ef4444;
  --ax-color-info: #6b7280;
  --ax-border-radius: 4px;
}
```

## 📚 开发指南

- [组件开发规范](../guide/component-guidelines) - 了解组件开发最佳实践
- [TDD 开发流程](../guide/tdd-workflow) - 测试驱动开发指南

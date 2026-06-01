# 快速开始

本指南将帮助您快速上手 Axis-UI 组件库的开发和使用。

## 📋 环境要求

- Node.js >= 20.19
- pnpm >= 10
- Vue 3.x

## 🚀 开发环境搭建

### 1. 克隆项目

```bash
git clone https://github.com/CalWade/Axis-UI.git
cd Axis-UI
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
# 启动组件预览
pnpm dev

# 启动文档站点
pnpm docs:dev
```

## 🧪 TDD 开发流程

### 1. 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 生成覆盖率报告
pnpm test:coverage

# 打开测试 UI
pnpm test:ui
```

### 2. 测试驱动开发

1. **编写测试**: 先编写测试用例，定义组件的行为
2. **运行测试**: 运行测试确保失败（Red）
3. **实现功能**: 编写最少的代码让测试通过（Green）
4. **重构优化**: 在测试通过的基础上优化代码（Refactor）

## 📚 文档开发

### 1. 启动文档站点

```bash
pnpm docs:dev
```

### 2. 添加组件文档

在 `docs/src/components/` 目录下创建组件文档：

```markdown
# Button 按钮

按钮组件用于触发操作。

## 基础用法

<demo src="./demos/basic.vue"></demo>

## API

| 参数 | 说明     | 类型                           | 默认值    |
| ---- | -------- | ------------------------------ | --------- |
| type | 按钮类型 | 'primary' \| 'secondary'       | 'primary' |
| size | 按钮尺寸 | 'small' \| 'medium' \| 'large' | 'medium'  |
```

## 🔧 开发工具

### 代码格式化

```bash
# 格式化代码
pnpm lint:fix
```

### 提交规范

项目使用 Conventional Commits 规范：

```bash
# 功能开发
git commit -m "feat: add button component"

# 修复问题
git commit -m "fix: resolve button click event"

# 文档更新
git commit -m "docs: update button documentation"
```

## 📦 构建和发布

### 构建所有包

```bash
pnpm build:all
```

### 版本管理与发布

项目使用 Changesets 进行版本管理：

```bash
# 1. 创建变更集 (在修改代码后运行)
npx changeset

# 2. 更新版本号 (消耗变更集)
pnpm run version

# 3. 发布到 npm
pnpm run release
```

### 构建文档

```bash
pnpm docs:build
```

## 🎯 下一步

- [TDD 开发流程](./tdd-workflow) - 深入学习测试驱动开发
- [组件开发规范](./component-guidelines) - 了解组件开发最佳实践

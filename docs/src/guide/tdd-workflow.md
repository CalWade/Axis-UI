# TDD 开发工作流程

本文档详细说明了 Axis-UI 项目中的测试驱动开发（TDD）工作流程，包括开发规范、最佳实践和自动化工具配置。

## 🎯 工作流程概览

```mermaid
graph TD
    A[开始新功能] --> B[编写测试用例]
    B --> C[运行测试 - 失败]
    C --> D[编写最小实现]
    D --> E[运行测试 - 通过]
    E --> F[重构优化]
    F --> G[运行测试 - 通过]
    G --> H[提交代码]
    H --> I[代码审查]
    I --> J[合并到主分支]
```

## 📋 开发规范

### 1. 分支命名规范

```bash
# 功能开发
feature/component-name
feature/button-component

# 问题修复
fix/issue-description
fix/button-click-event

# 文档更新
docs/update-readme
docs/add-component-docs

# 重构
refactor/component-structure
```

### 2. 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能开发
feat: add button component with variants
feat(button): add loading state support

# 问题修复
fix: resolve button click event not firing
fix(button): fix disabled state styling

# 文档更新
docs: update button component documentation
docs(api): add button props table

# 测试相关
test: add button component tests
test(button): add accessibility tests

# 构建相关
build: update vite configuration
chore: update dependencies
```

### 3. 测试文件命名规范

```
test/
├── components/
│   ├── button/
│   │   ├── button.spec.ts          # 单元测试
│   │   ├── button.integration.spec.ts  # 集成测试
│   │   └── button.e2e.spec.ts      # 端到端测试
│   └── icon/
│       └── icon.spec.ts
├── utils/
│   └── test-helpers.ts
└── setup/
    └── index.ts
```

## 🧪 测试策略

### 1. 测试金字塔

```
        /\
       /  \
      / E2E \     <- 少量端到端测试
     /______\
    /        \
   /Integration\  <- 适量集成测试
  /____________\
 /              \
/   Unit Tests   \  <- 大量单元测试
/________________\
```

### 2. 测试类型说明

#### 单元测试 (Unit Tests)

- **目标**: 测试单个函数或组件
- **范围**: 组件内部逻辑、工具函数
- **工具**: Vitest + Vue Test Utils
- **覆盖率门禁**: 以 `vitest.config.ts` 中的 thresholds 为准（随测试补齐逐步上调）

```typescript
// test/components/button/button.spec.ts
describe('AxButton', () => {
  it('should render with default props', () => {
    const wrapper = mount(AxButton)
    expect(wrapper.classes()).toContain('ax-button')
  })
})
```

#### 冒烟测试 (Smoke Tests)

- **目标**: 验证构建产物可用（导出完整、物理文件齐全）
- **工具**: `scripts/smoke-test.mjs`，在 CI 的 build 之后执行

> 集成测试与 E2E 测试目前尚未引入，属于后续规划。当前测试策略为
> 「单元/行为测试 + 构建产物冒烟测试」两层。

## 🛠️ 开发工具配置

### 1. VS Code 配置

```json
// .vscode/settings.json
{
  "vitest.enable": true,
  "vitest.commandLine": "pnpm test",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.spec.ts": "typescript",
    "*.test.ts": "typescript"
  }
}
```

### 2. Git Hooks 配置

```bash
# .husky/pre-commit
pnpm exec lint-staged
```

完整测试在 CI 中执行（本地提交只做增量 lint + 格式化，保持提交速度）。

### 3. CI/CD 配置

CI 配置见仓库中的 [.github/workflows/test.yml](https://github.com/CalWade/Axis-UI/blob/main/.github/workflows/test.yml)，
流水线顺序为：lint → type-check → 单元测试（含覆盖率上传 Codecov）→ 构建 → 冒烟测试 → 文档部署。

## 📊 质量指标

### 1. 覆盖率门禁

以 `vitest.config.ts` 的 `coverage.thresholds` 为唯一事实源：门禁按当前真实覆盖率设定，
防止倒退；每补齐一块测试盲区就上调对应阈值，目标是行/语句 85%+、分支 75%+。

### 2. 性能指标

| 指标         | 要求    | 说明                 |
| ------------ | ------- | -------------------- |
| 测试执行时间 | < 30s   | 完整测试套件执行时间 |
| 组件渲染时间 | < 100ms | 单个组件渲染时间     |
| 包大小增长   | < 10%   | 每次发布包大小增长   |

## 🔄 开发流程

### 1. 开始新功能

```bash
# 1. 创建功能分支
git checkout -b feature/new-component

# 2. 启动测试监听
pnpm test:watch

# 3. 启动开发服务器
pnpm dev
```

### 2. TDD 循环

```bash
# 1. 编写测试 (Red)
# 在 test/ 目录下创建测试文件

# 2. 运行测试确认失败
pnpm test

# 3. 编写最小实现 (Green)
# 在 packages/ 目录下实现功能

# 4. 运行测试确认通过
pnpm test

# 5. 重构优化 (Refactor)
# 在测试通过的基础上优化代码

# 6. 运行测试确认重构成功
pnpm test
```

### 3. 代码审查

```bash
# 1. 提交代码
git add .
git commit -m "feat: add new component"

# 2. 推送分支
git push origin feature/new-component

# 3. 创建 Pull Request
# 在 GitHub 上创建 PR

# 4. 代码审查
# 等待审查者反馈

# 5. 合并代码
# 审查通过后合并到主分支
```

## 📚 最佳实践

### 1. 测试编写

- **AAA 模式**: Arrange, Act, Assert
- **单一职责**: 每个测试只验证一个行为
- **描述性命名**: 测试名称应该清楚描述测试内容
- **独立性**: 测试之间不应该有依赖关系

### 2. 组件设计

- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 组件应该可以在不同场景下复用
- **可测试性**: 组件应该易于测试
- **类型安全**: 使用 TypeScript 确保类型安全

### 3. 文档维护

- **同步更新**: 代码和文档同步更新
- **示例完整**: 提供完整的使用示例
- **API 文档**: 详细的 API 文档
- **变更日志**: 记录每次变更

## 🚀 自动化工具

### 1. 测试自动化

```bash
# 监听模式
pnpm test:watch

# 覆盖率报告
pnpm test:coverage

# UI 模式
pnpm test:ui

# CI 模式
pnpm test:ci
```

### 2. 代码质量

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm type-check
```

### 3. 构建部署

```bash
# 构建组件库
pnpm build

# 构建文档
pnpm docs:build

# 预览文档
pnpm docs:preview
```

## 📈 持续改进

- 覆盖率阈值随测试补齐逐步上调，禁止下调
- 发现 bug 时先补一条能复现它的失败测试，再修复
- 测试优先覆盖行为与边界，避免"测 props 回读"这类同义反复用例

# 更新日志

版本发布由 [Changesets](https://github.com/changesets/changesets) 管理，完整、准确的发布记录见：

- [GitHub Releases](https://github.com/CalWade/Axis-UI/releases)
- 各包发布时自动生成的 CHANGELOG

## 当前状态（0.0.x）

已实现 7 个组件与配套工程链路：

- **组件**：Button、Icon、Input、Checkbox、Form / FormItem、Tree、VirtualList
- **构建**：ESM（preserveModules，支持 Tree-shaking）+ UMD 双格式，按组件粒度的 subpath exports
- **按需引入**：`AxisUIResolver` 对接 unplugin-vue-components，自动解析组件与样式
- **质量**：Vitest 单元测试 + 覆盖率门禁 + 构建产物冒烟测试，CI 自动执行
- **文档**：VitePress 文档站（当前站点）

## 反馈

- [GitHub Issues](https://github.com/CalWade/Axis-UI/issues)

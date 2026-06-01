---
'axis-ui': patch
'@axis-ui/theme-chalk': patch
---

修复库构建缺少 Vue JSX 转换导致 TSX 组件（VirtualList）产物损坏的问题；移除 virtual-list 样式中的调试边框；修正覆盖率阈值配置未生效的问题并补充 VirtualList 行为测试

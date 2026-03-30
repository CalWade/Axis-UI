# 主题定制

Axis-UI 采用 CSS Custom Properties（CSS 变量）驱动的主题系统，支持运行时动态切换。

## 亮色 / 暗色切换

```ts
import { useTheme } from '@axis-ui/utils'

const { mode, toggleMode, setMode } = useTheme()

// 切换亮暗模式
toggleMode()

// 或直接设置
setMode('dark')
```

## 自定义主题色

### 方式一：从主色生成（算法）

传入一个主色 HEX 值，自动通过 HSL 色轮算法派生完整配色方案：

```ts
import { useTheme, generateThemeFromColor } from '@axis-ui/utils'

const { applyTokens } = useTheme()
const tokens = generateThemeFromColor('#409eff')
applyTokens(tokens)
```

### 方式二：AI 生成

用自然语言描述你想要的主题风格，AI 自动生成配色：

```ts
import { useTheme, generateThemeWithAI } from '@axis-ui/utils'

const { applyTokens } = useTheme()
const tokens = await generateThemeWithAI('科技感蓝色主题', {
  apiKey: 'your-api-key',
  model: 'gpt-4o-mini', // 可选
})
applyTokens(tokens)
```

> AI 不可用时自动 fallback 到算法生成，确保离线也能工作。

### 方式三：手动指定

直接传入 CSS 变量键值对：

```ts
import { useTheme } from '@axis-ui/utils'

const { applyTokens } = useTheme()
applyTokens({
  '--ax-color-primary': '#409eff',
  '--ax-color-success': '#67c23a',
  '--ax-bg-color': '#f5f7fa',
})
```

## 恢复默认主题

```ts
const { resetTokens } = useTheme()
resetTokens()
```

## 可用的 CSS 变量

| 变量名 | 说明 | 默认值（樱花粉） |
| --- | --- | --- |
| `--ax-color-primary` | 主色调 | `#ff9eb5` |
| `--ax-color-primary-light` | 主色浅 | `#ffe0e9` |
| `--ax-color-primary-dark` | 主色深 | `#ff7a9c` |
| `--ax-color-success` | 成功色 | `#a8e6cf` |
| `--ax-color-warning` | 警告色 | `#ffd3b6` |
| `--ax-color-danger` | 危险色 | `#ffb3ba` |
| `--ax-color-info` | 信息色 | `#b8a9c9` |
| `--ax-bg-color` | 背景色 | `#fdf6f8` |
| `--ax-text-color` | 文字色 | `#2d1b3d` |
| `--ax-text-color-secondary` | 次要文字色 | `#b8a9c9` |
| `--ax-border-color` | 边框色 | `rgba(255,158,181,0.3)` |
| `--ax-shadow-sm` | 小阴影 | `0 2px 8px rgba(...)` |
| `--ax-shadow-md` | 中阴影 | `0 4px 12px rgba(...)` |
| `--ax-border-radius` | 圆角 | `8px` |
| `--ax-transition-duration` | 过渡时长 | `0.3s` |

## 在 CSS 中使用

```css
.my-component {
  color: var(--ax-text-color);
  background: var(--ax-bg-color);
  border: 1px solid var(--ax-border-color);
  border-radius: var(--ax-border-radius);
}
```

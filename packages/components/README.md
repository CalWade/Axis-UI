# axis-ui

一个现代化、轻量级的 Vue 3 组件库。

- 📖 [在线文档](https://calwade.github.io/Axis-UI/)
- 💻 [GitHub 仓库](https://github.com/CalWade/Axis-UI)

## 安装

```bash
pnpm add axis-ui
```

## 使用

```ts
import { createApp } from 'vue'
import AxisUI from 'axis-ui'
import 'axis-ui/dist/style.css'

createApp(App).use(AxisUI).mount('#app')
```

按需引入（配合 `unplugin-vue-components`）：

```ts
import { AxisUIResolver } from 'axis-ui/resolver'
```

详细用法见[文档站](https://calwade.github.io/Axis-UI/)。

// Node.js 自定义 loader：跳过 .css 文件的加载
// 使用方式：node --import ./scripts/css-loader-hook.mjs

import { register } from 'node:module'

register(new URL('./css-loader.mjs', import.meta.url))

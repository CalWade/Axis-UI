import { defineComponent } from 'vue'

// 组件库内部使用的内联 SVG 图标。
// 不能走 unplugin-icons 的编译期方案：<i-xxx> 魔法标签依赖消费端的构建插件，
// 库产物必须自包含，否则发布后图标在用户项目里无法解析。
// 图标继承字体尺寸与颜色（1em / currentColor），由外层 AxIcon 控制。

const svgAttrs = {
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
} as const

/** 展开箭头：配合样式在展开态旋转 90° */
export const CaretRightIcon = defineComponent({
  name: 'AxCaretRightIcon',
  setup() {
    return () => (
      <svg {...svgAttrs}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )
  },
})

/** 加载中 */
export const LoaderIcon = defineComponent({
  name: 'AxLoaderIcon',
  setup() {
    return () => (
      <svg {...svgAttrs}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    )
  },
})

/** 清空输入 */
export const CircleCloseIcon = defineComponent({
  name: 'AxCircleCloseIcon',
  setup() {
    return () => (
      <svg {...svgAttrs}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    )
  },
})

/** 密码可见 */
export const EyeIcon = defineComponent({
  name: 'AxEyeIcon',
  setup() {
    return () => (
      <svg {...svgAttrs}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
})

/** 密码隐藏 */
export const EyeOffIcon = defineComponent({
  name: 'AxEyeOffIcon',
  setup() {
    return () => (
      <svg {...svgAttrs}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  },
})

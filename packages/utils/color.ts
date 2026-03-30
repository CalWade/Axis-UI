import type { ThemeTokens } from './use-theme'

/**
 * HSL 颜色工具 — 从一个主色自动派生完整配色方案
 */

interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

/**
 * HEX → HSL
 */
export function hexToHsl(hex: string): HSL {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('')
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) }
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * HSL → HEX
 */
export function hslToHex(hsl: HSL): string {
  const { h, s: sRaw, l: lRaw } = hsl
  const s = sRaw / 100
  const l = lRaw / 100

  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * 从一个主色自动生成完整的亮色主题配色
 */
export function generateThemeFromColor(primaryHex: string): ThemeTokens {
  const primary = hexToHsl(primaryHex)

  // 主色变体
  const primaryLight: HSL = { h: primary.h, s: Math.min(primary.s + 10, 100), l: Math.min(primary.l + 25, 95) }
  const primaryDark: HSL = { h: primary.h, s: primary.s, l: Math.max(primary.l - 15, 20) }

  // 功能色 — 基于主色色相偏移
  const success: HSL = { h: (primary.h + 150) % 360, s: 55, l: 65 }
  const warning: HSL = { h: (primary.h + 40) % 360, s: 80, l: 75 }
  const danger: HSL = { h: (primary.h + 350) % 360, s: 70, l: 70 }
  const info: HSL = { h: (primary.h + 270) % 360, s: 25, l: 65 }

  // 辅助色
  const secondary: HSL = { h: (primary.h + 30) % 360, s: 40, l: 90 }
  const accent: HSL = { h: (primary.h + 330) % 360, s: 60, l: 85 }

  // 背景和文字
  const bgLight: HSL = { h: primary.h, s: Math.min(primary.s, 30), l: 98 }
  const textDark: HSL = { h: primary.h, s: 30, l: 15 }
  const textSecondary: HSL = { h: primary.h, s: 15, l: 55 }

  return {
    '--ax-color-primary': hslToHex(primary),
    '--ax-color-primary-light': hslToHex(primaryLight),
    '--ax-color-primary-dark': hslToHex(primaryDark),
    '--ax-color-success': hslToHex(success),
    '--ax-color-warning': hslToHex(warning),
    '--ax-color-danger': hslToHex(danger),
    '--ax-color-info': hslToHex(info),
    '--ax-color-secondary': hslToHex(secondary),
    '--ax-color-accent': hslToHex(accent),
    '--ax-bg-color': hslToHex(bgLight),
    '--ax-text-color': hslToHex(textDark),
    '--ax-text-color-secondary': hslToHex(textSecondary),
    '--ax-color-white': hslToHex(bgLight),
    '--ax-color-black': hslToHex(textDark),
  }
}

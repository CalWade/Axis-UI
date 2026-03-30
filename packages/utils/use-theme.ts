import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

export interface ThemeTokens {
  '--ax-color-primary'?: string
  '--ax-color-primary-light'?: string
  '--ax-color-primary-dark'?: string
  '--ax-color-success'?: string
  '--ax-color-warning'?: string
  '--ax-color-danger'?: string
  '--ax-color-info'?: string
  '--ax-color-white'?: string
  '--ax-color-black'?: string
  '--ax-color-secondary'?: string
  '--ax-color-accent'?: string
  '--ax-bg-color'?: string
  '--ax-text-color'?: string
  '--ax-text-color-secondary'?: string
  '--ax-border-color'?: string
  '--ax-border-color-hover'?: string
  [key: `--ax-${string}`]: string | undefined
}

const currentMode = ref<ThemeMode>('light')
const currentTokens = ref<ThemeTokens>({})

/**
 * 主题管理 composable
 *
 * @example
 * ```ts
 * const { mode, toggleMode, applyTokens } = useTheme()
 *
 * // 切换亮暗模式
 * toggleMode()
 *
 * // 应用自定义主题
 * applyTokens({ '--ax-color-primary': '#409eff' })
 * ```
 */
export function useTheme() {
  /**
   * 切换亮色/暗色模式
   */
  function toggleMode() {
    currentMode.value = currentMode.value === 'light' ? 'dark' : 'light'
  }

  /**
   * 设置指定模式
   */
  function setMode(mode: ThemeMode) {
    currentMode.value = mode
  }

  /**
   * 应用自定义主题 tokens（注入到 :root）
   */
  function applyTokens(tokens: ThemeTokens) {
    const root = document.documentElement
    for (const [key, value] of Object.entries(tokens)) {
      if (value != null) {
        root.style.setProperty(key, value)
      }
    }
    currentTokens.value = { ...currentTokens.value, ...tokens }
  }

  /**
   * 清除自定义 tokens，恢复默认主题
   */
  function resetTokens() {
    const root = document.documentElement
    for (const key of Object.keys(currentTokens.value)) {
      root.style.removeProperty(key)
    }
    currentTokens.value = {}
  }

  // 监听 mode 变化，同步到 DOM
  watch(
    currentMode,
    mode => {
      if (typeof document !== 'undefined') {
        if (mode === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }
    },
    { immediate: true },
  )

  return {
    /** 当前主题模式 */
    mode: currentMode,
    /** 当前自定义 tokens */
    tokens: currentTokens,
    /** 切换亮/暗模式 */
    toggleMode,
    /** 设置指定模式 */
    setMode,
    /** 应用自定义主题 tokens */
    applyTokens,
    /** 清除自定义 tokens，恢复默认 */
    resetTokens,
  }
}

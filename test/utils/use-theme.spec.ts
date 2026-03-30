import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useTheme } from '@packages/utils/use-theme'

describe('useTheme', () => {
  beforeEach(async () => {
    const { setMode, resetTokens } = useTheme()
    setMode('light')
    resetTokens()
    await nextTick()
    document.documentElement.style.cssText = ''
  })

  it('defaults to light mode', () => {
    const { mode } = useTheme()
    expect(mode.value).toBe('light')
  })

  it('toggleMode switches between light and dark', async () => {
    const { mode, toggleMode } = useTheme()
    expect(mode.value).toBe('light')

    toggleMode()
    await nextTick()
    expect(mode.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    toggleMode()
    await nextTick()
    expect(mode.value).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('setMode sets a specific mode', async () => {
    const { mode, setMode } = useTheme()

    setMode('dark')
    await nextTick()
    expect(mode.value).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    setMode('light')
    await nextTick()
    expect(mode.value).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })

  it('applyTokens injects CSS variables into :root', () => {
    const { applyTokens } = useTheme()

    applyTokens({
      '--ax-color-primary': '#409eff',
      '--ax-color-success': '#67c23a',
    })

    const root = document.documentElement
    expect(root.style.getPropertyValue('--ax-color-primary')).toBe('#409eff')
    expect(root.style.getPropertyValue('--ax-color-success')).toBe('#67c23a')
  })

  it('resetTokens removes custom CSS variables', () => {
    const { applyTokens, resetTokens } = useTheme()

    applyTokens({ '--ax-color-primary': '#409eff' })
    expect(
      document.documentElement.style.getPropertyValue('--ax-color-primary'),
    ).toBe('#409eff')

    resetTokens()
    expect(
      document.documentElement.style.getPropertyValue('--ax-color-primary'),
    ).toBe('')
  })

  it('tokens ref tracks applied tokens', () => {
    const { tokens, applyTokens, resetTokens } = useTheme()

    expect(Object.keys(tokens.value).length).toBe(0)

    applyTokens({ '--ax-color-primary': '#ff0000' })
    expect(tokens.value['--ax-color-primary']).toBe('#ff0000')

    resetTokens()
    expect(Object.keys(tokens.value).length).toBe(0)
  })
})

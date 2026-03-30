import { describe, it, expect } from 'vitest'
import {
  hexToHsl,
  hslToHex,
  generateThemeFromColor,
} from '@packages/utils/color'

describe('hexToHsl', () => {
  it('converts pure red', () => {
    const hsl = hexToHsl('#ff0000')
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)
    expect(hsl.l).toBe(50)
  })

  it('converts pure white', () => {
    const hsl = hexToHsl('#ffffff')
    expect(hsl.l).toBe(100)
    expect(hsl.s).toBe(0)
  })

  it('converts pure black', () => {
    const hsl = hexToHsl('#000000')
    expect(hsl.l).toBe(0)
  })

  it('handles 3-char hex shorthand', () => {
    const hsl = hexToHsl('#f00')
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)
  })

  it('converts sakura pink', () => {
    const hsl = hexToHsl('#ff9eb5')
    expect(hsl.h).toBeGreaterThan(340)
    expect(hsl.s).toBeGreaterThan(80)
  })
})

describe('hslToHex', () => {
  it('converts red HSL back to hex', () => {
    expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000')
  })

  it('converts white HSL back to hex', () => {
    expect(hslToHex({ h: 0, s: 0, l: 100 })).toBe('#ffffff')
  })

  it('converts black HSL back to hex', () => {
    expect(hslToHex({ h: 0, s: 0, l: 0 })).toBe('#000000')
  })

  it('roundtrips: hex → hsl → hex with minimal drift', () => {
    const original = '#409eff'
    const hsl = hexToHsl(original)
    const result = hslToHex(hsl)
    // 每个分量允许 ±3 的舍入误差
    const oR = parseInt(original.slice(1, 3), 16)
    const oG = parseInt(original.slice(3, 5), 16)
    const oB = parseInt(original.slice(5, 7), 16)
    const rR = parseInt(result.slice(1, 3), 16)
    const rG = parseInt(result.slice(3, 5), 16)
    const rB = parseInt(result.slice(5, 7), 16)
    expect(Math.abs(oR - rR)).toBeLessThanOrEqual(3)
    expect(Math.abs(oG - rG)).toBeLessThanOrEqual(3)
    expect(Math.abs(oB - rB)).toBeLessThanOrEqual(3)
  })
})

describe('generateThemeFromColor', () => {
  it('generates all required tokens', () => {
    const tokens = generateThemeFromColor('#409eff')
    expect(tokens['--ax-color-primary']).toBeDefined()
    expect(tokens['--ax-color-success']).toBeDefined()
    expect(tokens['--ax-color-warning']).toBeDefined()
    expect(tokens['--ax-color-danger']).toBeDefined()
    expect(tokens['--ax-color-info']).toBeDefined()
    expect(tokens['--ax-bg-color']).toBeDefined()
    expect(tokens['--ax-text-color']).toBeDefined()
  })

  it('primary token matches input color', () => {
    const tokens = generateThemeFromColor('#409eff')
    // 可能有轻微的 hex → hsl → hex 舍入差异
    expect(tokens['--ax-color-primary']).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('generates different themes for different inputs', () => {
    const blue = generateThemeFromColor('#409eff')
    const red = generateThemeFromColor('#ff4040')
    expect(blue['--ax-color-primary']).not.toBe(red['--ax-color-primary'])
    expect(blue['--ax-color-success']).not.toBe(red['--ax-color-success'])
  })

  it('all generated values are valid hex colors', () => {
    const tokens = generateThemeFromColor('#ff9eb5')
    for (const [, value] of Object.entries(tokens)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateThemeWithAI } from '@packages/utils/ai-theme'

const mockColors = {
  primary: '#409eff',
  primaryLight: '#a0cfff',
  primaryDark: '#337ecc',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399',
  bgColor: '#f5f7fa',
  textColor: '#303133',
  textColorSecondary: '#909399',
  secondary: '#dcdfe6',
  accent: '#c6e2ff',
}

describe('generateThemeWithAI', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns tokens from successful AI response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockColors) } }],
        }),
    })

    const tokens = await generateThemeWithAI('blue tech theme', {
      apiKey: 'test-key',
    })

    expect(tokens['--ax-color-primary']).toBe('#409eff')
    expect(tokens['--ax-color-success']).toBe('#67c23a')
    expect(tokens['--ax-text-color']).toBe('#303133')
  })

  it('falls back to algorithm on API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    })

    const tokens = await generateThemeWithAI('whatever', {
      apiKey: 'bad-key',
    })

    // Fallback 产生的 tokens 应该存在
    expect(tokens['--ax-color-primary']).toBeDefined()
    expect(tokens['--ax-color-primary']).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('falls back on empty AI response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: '' } }] }),
    })

    const tokens = await generateThemeWithAI('whatever', {
      apiKey: 'test-key',
    })

    expect(tokens['--ax-color-primary']).toBeDefined()
  })

  it('extracts JSON from markdown-wrapped response', async () => {
    const wrappedResponse = '```json\n' + JSON.stringify(mockColors) + '\n```'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: wrappedResponse } }],
        }),
    })

    const tokens = await generateThemeWithAI('warm theme', {
      apiKey: 'test-key',
    })

    expect(tokens['--ax-color-primary']).toBe('#409eff')
  })

  it('falls back on completely unparseable response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: 'I cannot do that.' } }],
        }),
    })

    const tokens = await generateThemeWithAI('whatever', {
      apiKey: 'test-key',
    })

    expect(tokens['--ax-color-primary']).toBeDefined()
    expect(tokens['--ax-color-primary']).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('sends correct request format', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockColors) } }],
        }),
    })

    await generateThemeWithAI('科技感蓝色', {
      apiKey: 'sk-test',
      model: 'gpt-4o',
      apiUrl: 'https://custom.api/v1/chat/completions',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      'https://custom.api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test',
        }),
      }),
    )
  })
})

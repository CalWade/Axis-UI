import type { ThemeTokens } from './use-theme'
import { generateThemeFromColor } from './color'

export interface AIThemeOptions {
  /** LLM API endpoint（兼容 OpenAI chat completions 格式） */
  apiUrl?: string
  /** API Key */
  apiKey: string
  /** 模型名称 */
  model?: string
}

const SYSTEM_PROMPT = `You are a UI theme color designer. Given a natural language description, generate a color scheme for a component library.

Respond with ONLY a valid JSON object (no markdown, no explanation) with exactly these keys, all values as hex colors:
{
  "primary": "#xxxxxx",
  "primaryLight": "#xxxxxx",
  "primaryDark": "#xxxxxx",
  "success": "#xxxxxx",
  "warning": "#xxxxxx",
  "danger": "#xxxxxx",
  "info": "#xxxxxx",
  "bgColor": "#xxxxxx",
  "textColor": "#xxxxxx",
  "textColorSecondary": "#xxxxxx",
  "secondary": "#xxxxxx",
  "accent": "#xxxxxx"
}

Requirements:
- Colors should be harmonious and visually appealing
- Ensure sufficient contrast between text and background
- Light theme by default (light background, dark text)`

/**
 * 通过 AI（LLM）生成主题配色
 *
 * @param description 自然语言描述，如 "科技感蓝色主题" 或 "warm orange autumn"
 * @param options API 配置
 * @returns ThemeTokens 可直接传入 useTheme().applyTokens()
 *
 * @example
 * ```ts
 * const tokens = await generateThemeWithAI('科技感蓝色', {
 *   apiKey: 'sk-xxx',
 * })
 * useTheme().applyTokens(tokens)
 * ```
 */
export async function generateThemeWithAI(
  description: string,
  options: AIThemeOptions,
): Promise<ThemeTokens> {
  const {
    apiUrl = 'https://api.openai.com/v1/chat/completions',
    apiKey,
    model = 'gpt-4o-mini',
  } = options

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: description },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    // AI 不可用时 fallback 到算法生成
    console.warn(
      `[Axis-UI] AI theme generation failed (${response.status}), falling back to algorithm`,
    )
    return generateThemeFromColor('#409eff')
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content?.trim()

  if (!content) {
    console.warn('[Axis-UI] AI returned empty response, falling back')
    return generateThemeFromColor('#409eff')
  }

  try {
    const colors = JSON.parse(content)
    return mapColorsToTokens(colors)
  } catch {
    // 尝试提取 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const colors = JSON.parse(jsonMatch[0])
        return mapColorsToTokens(colors)
      } catch {
        // 无法解析，fallback
      }
    }
    console.warn('[Axis-UI] Failed to parse AI response, falling back')
    return generateThemeFromColor('#409eff')
  }
}

function mapColorsToTokens(colors: Record<string, string>): ThemeTokens {
  return {
    '--ax-color-primary': colors.primary,
    '--ax-color-primary-light': colors.primaryLight,
    '--ax-color-primary-dark': colors.primaryDark,
    '--ax-color-success': colors.success,
    '--ax-color-warning': colors.warning,
    '--ax-color-danger': colors.danger,
    '--ax-color-info': colors.info,
    '--ax-bg-color': colors.bgColor,
    '--ax-text-color': colors.textColor,
    '--ax-text-color-secondary': colors.textColorSecondary,
    '--ax-color-secondary': colors.secondary,
    '--ax-color-accent': colors.accent,
    '--ax-color-white': colors.bgColor,
    '--ax-color-black': colors.textColor,
  }
}

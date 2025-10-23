import type { FontFamilyInfo, TypographyData } from '@src/types/theme'

/**
 * Extract font families from the page
 */
export function extractFontFamilies(): FontFamilyInfo[] {
  const fontMap = new Map<string, { usage: number; elements: Set<string> }>()
  const elements = document.querySelectorAll('*')

  const elementsToAnalyze = Array.from(elements).slice(0, 1000)

  for (const element of elementsToAnalyze) {
    if (
      element instanceof HTMLScriptElement ||
      element instanceof HTMLStyleElement ||
      element instanceof HTMLLinkElement
    ) {
      continue
    }

    const computedStyle = window.getComputedStyle(element)

    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      continue
    }

    const fontFamily = computedStyle.fontFamily
    if (fontFamily) {
      const fonts = parseFontFamily(fontFamily)

      for (const font of fonts) {
        if (fontMap.has(font)) {
          const existing = fontMap.get(font)
          if (existing) {
            existing.usage += 1
            existing.elements.add(element.tagName.toLowerCase())
          }
        } else {
          fontMap.set(font, {
            usage: 1,
            elements: new Set([element.tagName.toLowerCase()]),
          })
        }
      }
    }
  }

  return Array.from(fontMap.entries())
    .map(([family, data]) => ({
      family,
      usage: data.usage,
      elements: Array.from(data.elements),
    }))
    .sort((a, b) => b.usage - a.usage)
}

/**
 * Parse font-family string into individual font names
 */
function parseFontFamily(fontFamily: string): string[] {
  return fontFamily
    .split(',')
    .map((font) => font.trim().replace(/['"]/g, '').trim())
    .filter((font) => font.length > 0)
}

/**
 * Extract font sizes from the page
 */
export function extractFontSizes(): string[] {
  const sizes = new Set<string>()
  const elements = document.querySelectorAll('*')

  const elementsToAnalyze = Array.from(elements).slice(0, 1000)

  for (const element of elementsToAnalyze) {
    if (
      element instanceof HTMLScriptElement ||
      element instanceof HTMLStyleElement ||
      element instanceof HTMLLinkElement
    ) {
      continue
    }

    const computedStyle = window.getComputedStyle(element)

    if (computedStyle.display === 'none') {
      continue
    }

    const fontSize = computedStyle.fontSize
    if (fontSize && fontSize !== '0px') {
      sizes.add(fontSize)
    }
  }

  return Array.from(sizes).sort((a, b) => {
    const aNum = Number.parseFloat(a)
    const bNum = Number.parseFloat(b)
    return aNum - bNum
  })
}

/**
 * Extract font weights from the page
 */
export function extractFontWeights(): number[] {
  const weights = new Set<number>()
  const elements = document.querySelectorAll('*')

  const elementsToAnalyze = Array.from(elements).slice(0, 1000)

  for (const element of elementsToAnalyze) {
    if (
      element instanceof HTMLScriptElement ||
      element instanceof HTMLStyleElement ||
      element instanceof HTMLLinkElement
    ) {
      continue
    }

    const computedStyle = window.getComputedStyle(element)

    if (computedStyle.display === 'none') {
      continue
    }

    const fontWeight = computedStyle.fontWeight
    if (fontWeight) {
      const weight = Number.parseInt(fontWeight, 10)
      if (!Number.isNaN(weight)) {
        weights.add(weight)
      }
    }
  }

  return Array.from(weights).sort((a, b) => a - b)
}

/**
 * Extract line heights from the page
 */
export function extractLineHeights(): string[] {
  const lineHeights = new Set<string>()
  const elements = document.querySelectorAll('*')

  const elementsToAnalyze = Array.from(elements).slice(0, 1000)

  for (const element of elementsToAnalyze) {
    if (
      element instanceof HTMLScriptElement ||
      element instanceof HTMLStyleElement ||
      element instanceof HTMLLinkElement
    ) {
      continue
    }

    const computedStyle = window.getComputedStyle(element)

    if (computedStyle.display === 'none') {
      continue
    }

    const lineHeight = computedStyle.lineHeight
    if (lineHeight && lineHeight !== 'normal') {
      lineHeights.add(lineHeight)
    }
  }

  return Array.from(lineHeights)
}

/**
 * Extract letter spacings from the page
 */
export function extractLetterSpacings(): string[] {
  const letterSpacings = new Set<string>()
  const elements = document.querySelectorAll('*')

  const elementsToAnalyze = Array.from(elements).slice(0, 1000)

  for (const element of elementsToAnalyze) {
    if (
      element instanceof HTMLScriptElement ||
      element instanceof HTMLStyleElement ||
      element instanceof HTMLLinkElement
    ) {
      continue
    }

    const computedStyle = window.getComputedStyle(element)

    if (computedStyle.display === 'none') {
      continue
    }

    const letterSpacing = computedStyle.letterSpacing
    if (letterSpacing && letterSpacing !== 'normal') {
      letterSpacings.add(letterSpacing)
    }
  }

  return Array.from(letterSpacings)
}

/**
 * Extract text transforms from the page
 */
export function extractTextTransforms(): string[] {
  const transforms = new Set<string>()
  const elements = document.querySelectorAll('*')

  const elementsToAnalyze = Array.from(elements).slice(0, 1000)

  for (const element of elementsToAnalyze) {
    if (
      element instanceof HTMLScriptElement ||
      element instanceof HTMLStyleElement ||
      element instanceof HTMLLinkElement
    ) {
      continue
    }

    const computedStyle = window.getComputedStyle(element)

    if (computedStyle.display === 'none') {
      continue
    }

    const textTransform = computedStyle.textTransform
    if (textTransform && textTransform !== 'none') {
      transforms.add(textTransform)
    }
  }

  return Array.from(transforms)
}

/**
 * Main typography analysis function
 */
export function analyzeTypography(): TypographyData {
  return {
    fontFamilies: extractFontFamilies(),
    fontSizes: extractFontSizes(),
    fontWeights: extractFontWeights(),
    lineHeights: extractLineHeights(),
    letterSpacings: extractLetterSpacings(),
    textTransforms: extractTextTransforms(),
  }
}

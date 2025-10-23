import type { ColorInfo, ColorPalette } from '@src/types/theme'
import {
  deduplicateColors,
  parseColor,
  rgbToHex,
  rgbToHsl,
  sortByFrequency,
} from '@src/utils/colorUtils'

/**
 * Extract all colors from the page
 */
export function extractColors(): ColorInfo[] {
  const colorMap = new Map<string, ColorInfo>()
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

    const bgColor = computedStyle.backgroundColor
    if (bgColor) {
      addColor(colorMap, bgColor, 'background')
    }

    const textColor = computedStyle.color
    if (textColor) {
      addColor(colorMap, textColor, 'text')
    }

    const borderColor = computedStyle.borderColor
    if (borderColor) {
      addColor(colorMap, borderColor, 'border')
    }

    const outlineColor = computedStyle.outlineColor
    if (outlineColor) {
      addColor(colorMap, outlineColor, 'border')
    }
  }

  return Array.from(colorMap.values())
}

/**
 * Add color to the map, incrementing frequency if it exists
 */
function addColor(
  colorMap: Map<string, ColorInfo>,
  colorString: string,
  usage: ColorInfo['usage'],
): void {
  const rgb = parseColor(colorString)
  if (!rgb) return

  const hex = rgbToHex(rgb)

  if (colorMap.has(hex)) {
    const existing = colorMap.get(hex)
    if (existing) {
      existing.frequency += 1
    }
  } else {
    const hsl = rgbToHsl(rgb)
    colorMap.set(hex, {
      value: hex,
      rgb,
      hsl,
      usage,
      frequency: 1,
    })
  }
}

/**
 * Categorize colors into primary, secondary, accent, etc.
 */
export function categorizeColors(colors: ColorInfo[]): ColorPalette {
  const uniqueColors = deduplicateColors(colors)
  const sortedColors = sortByFrequency(uniqueColors)

  const backgrounds = sortedColors.filter((c) => c.usage === 'background')
  const texts = sortedColors.filter((c) => c.usage === 'text')
  const borders = sortedColors.filter((c) => c.usage === 'border')

  const neutrals = sortedColors.filter((c) => c.hsl.s < 20)

  const vibrantColors = sortedColors.filter((c) => c.hsl.s >= 40)

  const primary = vibrantColors
    .slice(0, 5)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const secondary = vibrantColors
    .slice(5, 10)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const accent = vibrantColors
    .filter((c) => !primary.includes(c.value) && !secondary.includes(c.value))
    .slice(0, 3)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const backgroundColors = backgrounds
    .slice(0, 5)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const textColors = texts
    .slice(0, 5)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const borderColors = borders
    .slice(0, 5)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const neutralColors = neutrals
    .slice(0, 8)
    .map((c) => c.value)
    .filter((v, i, arr) => arr.indexOf(v) === i)

  return {
    primary: primary.length > 0 ? primary : ['#000000'],
    secondary: secondary.length > 0 ? secondary : [],
    accent: accent.length > 0 ? accent : [],
    neutral: neutralColors.length > 0 ? neutralColors : ['#000000', '#ffffff'],
    background: backgroundColors.length > 0 ? backgroundColors : ['#ffffff', '#000000'],
    text: textColors.length > 0 ? textColors : ['#000000', '#ffffff'],
    border: borderColors.length > 0 ? borderColors : ['#cccccc'],
    all: sortedColors,
  }
}

/**
 * Analyze brand colors from images (logo detection)
 */
export async function extractBrandColors(): Promise<string[]> {
  const logoSelectors = [
    'img[alt*="logo" i]',
    'img[src*="logo" i]',
    '[class*="logo" i] img',
    '[id*="logo" i] img',
    'header img',
    'nav img',
  ]

  const logos: HTMLImageElement[] = []

  for (const selector of logoSelectors) {
    const elements = document.querySelectorAll(selector)
    for (const el of elements) {
      if (el instanceof HTMLImageElement && !logos.includes(el)) {
        logos.push(el)
      }
    }
  }

  // For now, return empty array - full implementation would analyze image data
  // This would require canvas manipulation and color quantization
  return []
}

/**
 * Main color analysis function
 */
export async function analyzeColors(): Promise<ColorPalette> {
  const colors = extractColors()
  const palette = categorizeColors(colors)

  const brandColors = await extractBrandColors()
  if (brandColors.length > 0) {
    palette.primary = [...new Set([...brandColors, ...palette.primary])]
  }

  return palette
}

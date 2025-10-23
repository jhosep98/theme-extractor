export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Parse a color string (rgb, rgba, hex, named) to RGB object
 */
export function parseColor(colorString: string): RGB | null {
  if (
    colorString === 'transparent' ||
    colorString === 'rgba(0, 0, 0, 0)' ||
    colorString === 'rgba(0,0,0,0)'
  ) {
    return null
  }

  const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)

  if (rgbMatch) {
    return {
      r: Number.parseInt(rgbMatch[1]),
      g: Number.parseInt(rgbMatch[2]),
      b: Number.parseInt(rgbMatch[3]),
    }
  }

  const hexMatch = colorString.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)

  if (hexMatch) {
    return {
      r: Number.parseInt(hexMatch[1], 16),
      g: Number.parseInt(hexMatch[2], 16),
      b: Number.parseInt(hexMatch[3], 16),
    }
  }

  const shortHexMatch = colorString.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i)

  if (shortHexMatch) {
    return {
      r: Number.parseInt(shortHexMatch[1] + shortHexMatch[1], 16),
      g: Number.parseInt(shortHexMatch[2] + shortHexMatch[2], 16),
      b: Number.parseInt(shortHexMatch[3] + shortHexMatch[3], 16),
    }
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = colorString
      ctx.fillRect(0, 0, 1, 1)
      const imageData = ctx.getImageData(0, 0, 1, 1).data
      return {
        r: imageData[0],
        g: imageData[1],
        b: imageData[2],
      }
    }
  } catch {
    // Failed to parse
  }

  return null
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Calculate color difference using Delta E (simplified)
 */
export function colorDistance(rgb1: RGB, rgb2: RGB): number {
  const rDiff = rgb1.r - rgb2.r
  const gDiff = rgb1.g - rgb2.g
  const bDiff = rgb1.b - rgb2.b
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
}

/**
 * Check if color is similar to another color within threshold
 */
export function isSimilarColor(rgb1: RGB, rgb2: RGB, threshold = 30): boolean {
  return colorDistance(rgb1, rgb2) < threshold
}

/**
 * Get luminance of a color (0-1)
 */
export function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb
  const a = [r, g, b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
 * Check if color is dark (luminance < 0.5)
 */
export function isDarkColor(rgb: RGB): boolean {
  return getLuminance(rgb) < 0.5
}

/**
 * Check if color is light (luminance >= 0.5)
 */
export function isLightColor(rgb: RGB): boolean {
  return getLuminance(rgb) >= 0.5
}

/**
 * Deduplicate similar colors
 */
export function deduplicateColors<T extends { rgb: RGB }>(colors: T[], threshold = 30): T[] {
  const unique: T[] = []

  for (const color of colors) {
    const isDuplicate = unique.some((existing) =>
      isSimilarColor(color.rgb, existing.rgb, threshold),
    )

    if (!isDuplicate) {
      unique.push(color)
    }
  }

  return unique
}

/**
 * Sort colors by usage frequency
 */
export function sortByFrequency<T extends { frequency: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.frequency - a.frequency)
}

/**
 * Normalize color value to hex
 */
export function normalizeColor(colorString: string): string | null {
  const rgb = parseColor(colorString)
  return rgb ? rgbToHex(rgb) : null
}

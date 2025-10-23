import type { SpacingData } from '@src/types/theme'

/**
 * Extract margin values from the page
 */
export function extractMargins(): string[] {
  const margins = new Set<string>()
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

    const marginTop = computedStyle.marginTop
    const marginRight = computedStyle.marginRight
    const marginBottom = computedStyle.marginBottom
    const marginLeft = computedStyle.marginLeft

    addSpacingValue(margins, marginTop)
    addSpacingValue(margins, marginRight)
    addSpacingValue(margins, marginBottom)
    addSpacingValue(margins, marginLeft)
  }

  return sortSpacingValues(Array.from(margins))
}

/**
 * Extract padding values from the page
 */
export function extractPadding(): string[] {
  const padding = new Set<string>()
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

    const paddingTop = computedStyle.paddingTop
    const paddingRight = computedStyle.paddingRight
    const paddingBottom = computedStyle.paddingBottom
    const paddingLeft = computedStyle.paddingLeft

    addSpacingValue(padding, paddingTop)
    addSpacingValue(padding, paddingRight)
    addSpacingValue(padding, paddingBottom)
    addSpacingValue(padding, paddingLeft)
  }

  return sortSpacingValues(Array.from(padding))
}

/**
 * Extract gap values from the page (for flexbox/grid)
 */
export function extractGaps(): string[] {
  const gaps = new Set<string>()
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

    const gap = computedStyle.gap
    const rowGap = computedStyle.rowGap
    const columnGap = computedStyle.columnGap

    addSpacingValue(gaps, gap)
    addSpacingValue(gaps, rowGap)
    addSpacingValue(gaps, columnGap)
  }

  return sortSpacingValues(Array.from(gaps))
}

/**
 * Add spacing value to set if it's meaningful
 */
function addSpacingValue(set: Set<string>, value: string): void {
  if (!value) return

  if (value === '0px' || value === 'auto' || value === 'normal') {
    return
  }

  if (value.endsWith('px') || value.endsWith('rem') || value.endsWith('em')) {
    set.add(value)
  }
}

/**
 * Sort spacing values numerically
 */
function sortSpacingValues(values: string[]): string[] {
  return values.sort((a, b) => {
    const aNum = Number.parseFloat(a)
    const bNum = Number.parseFloat(b)
    return aNum - bNum
  })
}

/**
 * Find common spacing values (values that appear frequently)
 */
export function findCommonSpacing(margins: string[], padding: string[], gaps: string[]): string[] {
  const frequencyMap = new Map<string, number>()

  for (const value of [...margins, ...padding, ...gaps]) {
    frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1)
  }

  const common = Array.from(frequencyMap.entries())
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([value]) => value)

  return common
}

/**
 * Detect if there's a spacing scale (like 8px base)
 */
export function detectSpacingScale(values: string[]): number | null {
  const numericValues = values
    .filter((v) => v.endsWith('px'))
    .map((v) => Number.parseFloat(v))
    .filter((v) => v > 0)

  if (numericValues.length < 3) return null

  const potentialBases = [4, 8, 16]

  for (const base of potentialBases) {
    const matches = numericValues.filter((v) => v % base === 0)
    if (matches.length / numericValues.length > 0.7) {
      return base
    }
  }

  return null
}

/**
 * Main spacing analysis function
 */
export function analyzeSpacing(): SpacingData {
  const margins = extractMargins()
  const padding = extractPadding()
  const gaps = extractGaps()
  const common = findCommonSpacing(margins, padding, gaps)

  return {
    margins,
    padding,
    gaps,
    common,
  }
}

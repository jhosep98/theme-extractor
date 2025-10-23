import type { ButtonStyle, CardStyle, ComponentData, FormStyle, LinkStyle } from '@src/types/theme'

/**
 * Extract button styles from the page
 */
export function extractButtonStyles(): ButtonStyle[] {
  const buttons: ButtonStyle[] = []
  const buttonElements = document.querySelectorAll(
    'button, input[type="button"], input[type="submit"], [role="button"], a.btn, .button',
  )

  const buttonsToAnalyze = Array.from(buttonElements).slice(0, 20)

  for (const button of buttonsToAnalyze) {
    const computedStyle = window.getComputedStyle(button)

    if (computedStyle.display === 'none') {
      continue
    }

    const selector = getElementSelector(button)

    buttons.push({
      backgroundColor: computedStyle.backgroundColor,
      color: computedStyle.color,
      padding: computedStyle.padding,
      borderRadius: computedStyle.borderRadius,
      border: computedStyle.border,
      fontSize: computedStyle.fontSize,
      fontWeight: Number.parseInt(computedStyle.fontWeight, 10),
      selector,
    })
  }

  return buttons
}

/**
 * Extract form input styles from the page
 */
export function extractFormStyles(): FormStyle[] {
  const forms: FormStyle[] = []
  const inputElements = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, select',
  )

  const inputsToAnalyze = Array.from(inputElements).slice(0, 20)

  for (const input of inputsToAnalyze) {
    const computedStyle = window.getComputedStyle(input)

    if (computedStyle.display === 'none') {
      continue
    }

    const selector = getElementSelector(input)

    forms.push({
      inputBackground: computedStyle.backgroundColor,
      inputBorder: computedStyle.border,
      inputBorderRadius: computedStyle.borderRadius,
      inputPadding: computedStyle.padding,
      inputFontSize: computedStyle.fontSize,
      focusBorderColor: computedStyle.borderColor, // Note: Can't detect :focus without interaction
      selector,
    })
  }

  return forms
}

/**
 * Extract card/container styles from the page
 */
export function extractCardStyles(): CardStyle[] {
  const cards: CardStyle[] = []
  const cardElements = document.querySelectorAll(
    '.card, [class*="card"], article, .panel, [class*="container"]',
  )

  const cardsToAnalyze = Array.from(cardElements).slice(0, 20)

  for (const card of cardsToAnalyze) {
    const computedStyle = window.getComputedStyle(card)

    if (computedStyle.display === 'none') {
      continue
    }

    const selector = getElementSelector(card)

    cards.push({
      backgroundColor: computedStyle.backgroundColor,
      border: computedStyle.border,
      borderRadius: computedStyle.borderRadius,
      padding: computedStyle.padding,
      boxShadow: computedStyle.boxShadow,
      selector,
    })
  }

  return cards
}

/**
 * Extract link styles from the page
 */
export function extractLinkStyles(): LinkStyle[] {
  const links: LinkStyle[] = []
  const linkElements = document.querySelectorAll('a')

  const linksToAnalyze = Array.from(linkElements).slice(0, 30)

  for (const link of linksToAnalyze) {
    const computedStyle = window.getComputedStyle(link)

    if (computedStyle.display === 'none') {
      continue
    }

    const selector = getElementSelector(link)

    links.push({
      color: computedStyle.color,
      textDecoration: computedStyle.textDecoration,
      hoverColor: computedStyle.color, // Note: Can't detect :hover without interaction
      selector,
    })
  }

  return links
}

/**
 * Generate a simple CSS selector for an element
 */
function getElementSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`
  }

  if (element.className && typeof element.className === 'string') {
    const classes = element.className
      .trim()
      .split(/\s+/)
      .filter((c) => c.length > 0)
      .slice(0, 2)
      .join('.')

    if (classes) {
      return `${element.tagName.toLowerCase()}.${classes}`
    }
  }

  return element.tagName.toLowerCase()
}

/**
 * Main component analysis function
 */
export function analyzeComponents(): ComponentData {
  return {
    buttons: extractButtonStyles(),
    forms: extractFormStyles(),
    cards: extractCardStyles(),
    links: extractLinkStyles(),
  }
}

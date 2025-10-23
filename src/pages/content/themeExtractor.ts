import type { ThemeData } from '@src/types/theme'
import { analyzeColors } from './colorAnalyzer'
import { analyzeComponents } from './componentAnalyzer'
import { analyzeSpacing } from './spacingAnalyzer'
import { analyzeTypography } from './typographyAnalyzer'

/**
 * Main ThemeExtractor class for analyzing page themes
 */
export class ThemeExtractor {
  async extractTheme(): Promise<ThemeData> {
    const startTime = performance.now()

    try {
      const [colors, typography, spacing, components] = await Promise.all([
        analyzeColors(),
        Promise.resolve(analyzeTypography()),
        Promise.resolve(analyzeSpacing()),
        Promise.resolve(analyzeComponents()),
      ])

      const endTime = performance.now()
      const analysisTime = Math.round(endTime - startTime)

      return {
        colors,
        typography,
        spacing,
        components,
        metadata: this.generateMetadata(analysisTime),
      }
    } catch (error) {
      console.error('Error extracting theme:', error)
      throw new Error(
        `Failed to extract theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Generate metadata about the extraction
   */
  private generateMetadata(analysisTime: number) {
    return {
      url: window.location.href,
      title: document.title,
      extractedAt: new Date().toISOString(),
      totalElements: document.querySelectorAll('*').length,
      analysisTime,
    }
  }

  /**
   * Check if the page is ready for analysis
   */
  isPageReady(): boolean {
    return document.readyState === 'complete' || document.readyState === 'interactive'
  }

  /**
   * Wait for the page to be ready
   */
  async waitForPageReady(timeout = 5000): Promise<void> {
    if (this.isPageReady()) {
      return
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for page to be ready'))
      }, timeout)

      const checkReady = () => {
        if (this.isPageReady()) {
          clearTimeout(timeoutId)
          resolve()
        }
      }

      document.addEventListener('DOMContentLoaded', checkReady, { once: true })

      window.addEventListener('load', checkReady, { once: true })

      checkReady()
    })
  }
}

/**
 * Create a singleton instance
 */
export const themeExtractor = new ThemeExtractor()

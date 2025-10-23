import './style.css'
import type { ThemeData } from '@src/types/theme'
import { themeExtractor } from './themeExtractor'

console.log('Theme Extractor content script loaded')

chrome.runtime.onMessage.addListener(
  (
    request: { type: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: {
      type: string
      data?: ThemeData
      error?: string
    }) => void,
  ) => {
    if (request.type === 'EXTRACT_THEME') {
      console.log('Received EXTRACT_THEME request')

      themeExtractor
        .extractTheme()
        .then((themeData) => {
          console.log('Theme extracted successfully:', themeData)
          sendResponse({
            type: 'THEME_RESULT',
            data: themeData,
          })
        })
        .catch((error) => {
          console.error('Error extracting theme:', error)
          sendResponse({
            type: 'THEME_ERROR',
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          })
        })

      return true
    }

    return false
  },
)

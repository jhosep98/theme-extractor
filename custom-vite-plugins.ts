import fs from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

// plugin to remove dev icons from prod build
export function stripDevIcons(isDev: boolean): Plugin | null {
  if (isDev) return null

  return {
    name: 'strip-dev-icons',
    resolveId(source: string) {
      return source === 'virtual-module' ? source : null
    },
    renderStart(outputOptions: unknown) {
      const outDir = (outputOptions as { dir: string }).dir
      fs.rm(resolve(outDir, 'dev-icon-32.png'), () =>
        console.log('Deleted dev-icon-32.png from prod build'),
      )
      fs.rm(resolve(outDir, 'dev-icon-128.png'), () =>
        console.log('Deleted dev-icon-128.png from prod build'),
      )
    },
  }
}

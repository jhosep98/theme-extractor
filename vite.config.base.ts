import { resolve } from 'node:path'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { type BuildOptions, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { stripDevIcons } from './custom-vite-plugins'
import devManifest from './manifest.dev.json'
import manifest from './manifest.json'
import pkg from './package.json'

const isDev = process.env.__DEV__ === 'true'

export const baseManifest = {
  ...manifest,
  version: pkg.version,
  ...(isDev ? devManifest : ({} as ManifestV3Export)),
} as ManifestV3Export

export const baseBuildOptions: BuildOptions = {
  sourcemap: isDev,
  emptyOutDir: !isDev,
}

const basePlugins = stripDevIcons(isDev) || []

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths(), react(), basePlugins],
  publicDir: resolve(__dirname, 'public'),
})

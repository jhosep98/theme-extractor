# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Theme Extractor is a cross-browser extension (Chrome/Firefox) that analyzes and extracts design themes from websites, including colors, typography, spacing, and component styles. It's built with React, TypeScript, Vite, and TailwindCSS, targeting Manifest V3.

## Build Commands

### Development
- `pnpm dev` or `pnpm dev:chrome` - Development build with hot reload for Chrome (outputs to `dist_chrome`)
- `pnpm dev:firefox` - Development build with hot reload for Firefox (outputs to `dist_firefox`)
- Development uses nodemon to watch for file changes and rebuild automatically

### Production
- `pnpm build` or `pnpm build:chrome` - Production build for Chrome
- `pnpm build:firefox` - Production build for Firefox

### Code Quality
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm format` - Run Biome formatter
- `pnpm check` - Run both linting and formatting

## Architecture

### Extension Structure (Manifest V3)

The extension follows the standard Manifest V3 architecture with three main components:

1. **Popup** (`src/pages/popup/`): React-based UI that displays extracted theme data. Entry point is `index.tsx` which renders `Popup.tsx`. Uses TailwindCSS for styling.

2. **Content Script** (`src/pages/content/`): Injected into web pages to analyze DOM and computed styles. This is where the core theme extraction logic will live.

3. **Background Service Worker** (`src/pages/background/index.ts`): Handles cross-component communication and lifecycle management.

### Build Configuration

The project uses a **multi-config Vite setup**:
- `vite.config.base.ts` - Shared configuration (React, TailwindCSS, path aliases)
- `vite.config.chrome.ts` - Chrome-specific build (outputs to `dist_chrome`)
- `vite.config.firefox.ts` - Firefox-specific build (outputs to `dist_firefox`)

Key features:
- Uses `@crxjs/vite-plugin` for extension bundling
- Custom plugin (`custom-vite-plugins.ts`) strips dev icons from production builds
- Path aliases configured via `tsconfig.json`: `@src/*`, `@assets/*`, `@pages/*`, `@locales/*`

### TypeScript Configuration

- Strict mode enabled
- Module resolution: `bundler`
- JSX: `react-jsx`
- Path aliases must be kept in sync between `tsconfig.json` and Vite config

### Code Style (Biome)

- Uses Biome for both linting and formatting (not ESLint/Prettier)
- Key style rules:
  - Single quotes for JSX and JavaScript
  - Arrow parentheses always required
  - Trailing commas required
  - Semicolons: as needed (ASI)
  - Line width: 100 characters for JS, 80 for general
  - Indent: 2 spaces
- Ignores: `node_modules`, `dist`, `dist_chrome`, `public`, `src/assets`

## Theme Extraction Implementation

The core feature (theme extraction) is **not yet implemented**. When implementing:

1. The content script should analyze:
   - Computed styles of visible elements
   - CSS custom properties (design tokens)
   - Color palettes (from backgrounds, text, borders, images)
   - Typography patterns (font families, sizes, weights)
   - Spacing values (margins, padding, gaps)
   - Component patterns (buttons, forms, cards)

2. Communication flow should be:
   - Popup requests analysis → Background worker → Content script
   - Content script performs analysis → Background worker → Popup displays results

3. Expected output format (from README):
```json
{
  "colors": { "primary": [...], "secondary": [...], "neutral": [...] },
  "typography": { "fontFamilies": [...], "fontSizes": [...], "fontWeights": [...] },
  "spacing": { "margins": [...], "padding": [...], "gaps": [...] },
  "components": { "buttons": {...}, "forms": {...}, "cards": {...} }
}
```

## Development Workflow

1. **Loading the extension for testing**:
   - Run `pnpm dev` or `pnpm dev:chrome`
   - Open Chrome: `chrome://extensions/`
   - Enable Developer mode
   - Load unpacked: select `dist_chrome` folder
   - Extension will hot-reload on file changes

2. **Making changes**:
   - Always run `pnpm check` before committing
   - Use the configured path aliases (`@pages/*`, `@assets/*`, etc.)
   - Follow Biome style rules (single quotes, trailing commas, etc.)

3. **Testing Firefox**:
   - Run `pnpm dev:firefox`
   - Open Firefox: `about:debugging#/runtime/this-firefox`
   - Load temporary add-on: select any file from `dist_firefox`

## Key Conventions

- Component files use PascalCase (e.g., `Popup.tsx`)
- Entry points use lowercase (e.g., `index.tsx`, `index.ts`)
- TailwindCSS classes are used for all styling
- Manifest files are in project root: `manifest.json` (base) and `manifest.dev.json` (dev overrides)
- Dev builds use different icons (dev-icon-*.png) which are stripped from production builds

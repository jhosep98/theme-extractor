# Theme Extractor

A powerful browser extension that automatically extracts and analyzes the visual theme of any website, including colors, typography, spacing, and design patterns. Get instant access to a website's design system in structured JSON format.

## Features

### 🎨 Comprehensive Theme Analysis

- **Color Palette**: Primary, secondary, accent colors, and full color schemes
- **Typography**: Font families, sizes, weights, and text styles
- **Layout & Spacing**: Margins, padding, grid systems, and breakpoints
- **Component Styles**: Buttons, forms, cards, and other UI elements
- **CSS Variables**: Custom properties and design tokens
- **Brand Colors**: Logo and brand-specific color extraction

### 🚀 Smart Detection

- Analyzes computed styles from the active tab
- Detects CSS custom properties and design systems
- Identifies color usage patterns and hierarchies
- Extracts responsive design breakpoints
- Recognizes popular CSS frameworks (Tailwind, Bootstrap, etc.)

### 📋 Export Options

- Structured JSON format for developers
- CSS custom properties format
- Tailwind config compatible output
- Copy to clipboard functionality
- Save as file option

## Installation

### From Source (Development)

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd theme-extractor
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the extension:
   ```bash
   pnpm build
   ```
4. Load in browser:
   - Open Chrome/Edge: `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist_chrome` folder

### From Chrome Web Store

_Coming soon - extension will be published to the Chrome Web Store_

## How to Use

1. **Navigate** to any website you want to analyze
2. **Click** the Theme Extractor icon in your browser toolbar
3. **Wait** for the analysis to complete (usually 1-2 seconds)
4. **Review** the extracted theme data in the popup
5. **Copy** the results to your clipboard or save as a file
6. **Use** the theme data in your own projects

## Technical Architecture

### Extension Components

- **Popup UI** (`src/pages/popup/`): React-based interface for displaying results
- **Content Script** (`src/pages/content/`): Injected into web pages to analyze DOM and styles
- **Background Script** (`src/pages/background/`): Handles communication between components
- **Manifest V3**: Modern extension architecture with proper permissions

### Theme Detection Algorithm

1. **DOM Analysis**: Scans all visible elements and their computed styles
2. **Color Extraction**: Identifies colors from backgrounds, text, borders, and images
3. **Typography Analysis**: Extracts font families, sizes, and text styling patterns
4. **Layout Detection**: Analyzes spacing, grid systems, and responsive patterns
5. **Component Recognition**: Identifies common UI patterns and components
6. **Data Structuring**: Organizes findings into a coherent theme object

### Extracted Data Structure

```json
{
  "colors": {
    "primary": ["#1a73e8", "#4285f4"],
    "secondary": ["#34a853", "#fbbc04"],
    "neutral": ["#202124", "#5f6368", "#dadce0"],
    "background": ["#ffffff", "#f8f9fa"],
    "text": ["#202124", "#5f6368"]
  },
  "typography": {
    "fontFamilies": ["Roboto", "Arial", "sans-serif"],
    "fontSizes": ["14px", "16px", "20px", "24px"],
    "fontWeights": [400, 500, 700],
    "lineHeights": ["1.4", "1.5", "1.6"]
  },
  "spacing": {
    "margins": ["8px", "16px", "24px", "32px"],
    "padding": ["8px", "12px", "16px", "24px"],
    "gaps": ["8px", "16px", "24px"]
  },
  "components": {
    "buttons": {...},
    "forms": {...},
    "cards": {...}
  }
}
```

## Development

### Prerequisites

- Node.js 18+ and pnpm
- Chrome/Edge browser for testing

### Setup

```bash
# Install dependencies
pnpm install

# Development build with hot reload
pnpm dev

# Production build
pnpm build

# Run tests
pnpm test
```

### Project Structure

```
src/
├── pages/
│   ├── popup/          # Extension popup UI
│   ├── content/        # Content script for theme analysis
│   └── background/     # Background service worker
├── assets/             # Static assets and styles
└── types/              # TypeScript type definitions
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## Roadmap

- [ ] **v1.0**: Basic theme extraction (colors, fonts, spacing)
- [ ] **v1.1**: Component analysis and pattern recognition
- [ ] **v1.2**: Export to popular design tools (Figma, Sketch)
- [ ] **v1.3**: Theme comparison between websites
- [ ] **v2.0**: AI-powered design system generation
- [ ] **v2.1**: Integration with popular CSS frameworks

## Privacy & Permissions

This extension requires minimal permissions:

- **activeTab**: To analyze the currently active tab's styles
- **No data collection**: All analysis happens locally in your browser
- **No external requests**: Extension works completely offline

## License

Apache License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 **Bug Reports**: [GitHub Issues](../../issues)
- 💡 **Feature Requests**: [GitHub Discussions](../../discussions)
- 📧 **Contact**: [jhosepdb149@gmail.com]

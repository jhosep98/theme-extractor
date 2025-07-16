# Theme Extractor Implementation Plan

## Overview

This plan outlines the step-by-step implementation of the theme extraction functionality for the browser extension. The extension will analyze the active tab's visual theme when the icon is clicked.

## Architecture Flow

```
User clicks extension icon → Popup opens → Content script analyzes page → Results displayed in popup
```

## Phase 1: Core Infrastructure (Priority: High)

### 1.1 Content Script Enhancement

**File**: `src/pages/content/index.tsx`

- Implement DOM analysis functions
- Create style computation utilities
- Add color extraction algorithms
- Build typography analysis
- Implement spacing detection

### 1.2 Message Passing System

**Files**: `src/pages/background/index.ts`, popup components

- Set up communication between popup and content script
- Handle async theme extraction requests
- Implement error handling and timeouts

### 1.3 Popup UI Enhancement

**File**: `src/pages/popup/Popup.tsx`

- Add loading states during analysis
- Implement result display components
- Add copy to clipboard functionality
- Create error handling UI

## Phase 2: Theme Analysis Engine (Priority: High)

### 2.1 Color Extraction

**Functions to implement**:

- `extractColors()`: Get all colors from computed styles
- `categorizeColors()`: Group colors by usage (primary, secondary, etc.)
- `analyzeColorUsage()`: Determine color hierarchy and patterns
- `extractBrandColors()`: Identify logo and brand-specific colors

### 2.2 Typography Analysis

**Functions to implement**:

- `extractFonts()`: Get all font families used
- `analyzeFontSizes()`: Extract and categorize font sizes
- `detectTypographyScale()`: Identify type scale patterns
- `extractTextStyles()`: Get font weights, line heights, etc.

### 2.3 Layout & Spacing

**Functions to implement**:

- `extractSpacing()`: Analyze margins, padding, gaps
- `detectGridSystems()`: Identify CSS Grid and Flexbox patterns
- `analyzeBreakpoints()`: Extract responsive design breakpoints
- `measureLayoutPatterns()`: Identify common spacing patterns

## Phase 3: Advanced Analysis (Priority: Medium)

### 3.1 Component Recognition

**Functions to implement**:

- `identifyButtons()`: Extract button styles and variants
- `analyzeForms()`: Get form element styling
- `detectCards()`: Identify card/container patterns
- `extractNavigation()`: Analyze navigation styles

### 3.2 CSS Framework Detection

**Functions to implement**:

- `detectTailwind()`: Identify Tailwind CSS usage
- `detectBootstrap()`: Identify Bootstrap patterns
- `detectCustomProperties()`: Extract CSS custom properties
- `analyzeDesignTokens()`: Identify design system tokens

## Phase 4: Export & Utilities (Priority: Medium)

### 4.1 Data Formatting

**Functions to implement**:

- `formatAsJSON()`: Structure data for JSON export
- `formatAsCSSVars()`: Convert to CSS custom properties
- `formatAsTailwindConfig()`: Generate Tailwind config
- `generateColorPalette()`: Create organized color palette

### 4.2 Export Features

**Functions to implement**:

- `copyToClipboard()`: Copy formatted data
- `downloadAsFile()`: Save as JSON/CSS file
- `generateReport()`: Create human-readable report

## Implementation Details

### Content Script Structure

```typescript
// src/pages/content/themeExtractor.ts
interface ThemeData {
  colors: ColorPalette;
  typography: TypographyData;
  spacing: SpacingData;
  components: ComponentData;
  metadata: MetaData;
}

class ThemeExtractor {
  async extractTheme(): Promise<ThemeData> {
    const colors = await this.extractColors();
    const typography = await this.extractTypography();
    const spacing = await this.extractSpacing();
    const components = await this.extractComponents();

    return {
      colors,
      typography,
      spacing,
      components,
      metadata: this.generateMetadata(),
    };
  }
}
```

### Message Passing Protocol

```typescript
// Message types
interface ExtractThemeMessage {
  type: "EXTRACT_THEME";
}

interface ThemeResultMessage {
  type: "THEME_RESULT";
  data: ThemeData;
}

interface ThemeErrorMessage {
  type: "THEME_ERROR";
  error: string;
}
```

### Popup State Management

```typescript
// src/pages/popup/hooks/useThemeExtraction.ts
interface ThemeState {
  loading: boolean;
  data: ThemeData | null;
  error: string | null;
}

const useThemeExtraction = () => {
  const [state, setState] = useState<ThemeState>({
    loading: false,
    data: null,
    error: null,
  });

  const extractTheme = async () => {
    setState({ loading: true, data: null, error: null });
    // Implementation
  };

  return { ...state, extractTheme };
};
```

## File Structure Changes

### New Files to Create

```
src/
├── pages/
│   ├── content/
│   │   ├── themeExtractor.ts      # Main extraction logic
│   │   ├── colorAnalyzer.ts       # Color extraction utilities
│   │   ├── typographyAnalyzer.ts  # Typography analysis
│   │   ├── spacingAnalyzer.ts     # Spacing and layout analysis
│   │   └── componentAnalyzer.ts   # Component recognition
│   ├── popup/
│   │   ├── components/
│   │   │   ├── ThemeDisplay.tsx   # Theme data display
│   │   │   ├── LoadingState.tsx   # Loading indicator
│   │   │   └── ErrorState.tsx     # Error handling
│   │   └── hooks/
│   │       └── useThemeExtraction.ts # Theme extraction hook
│   └── background/
│       └── messageHandler.ts      # Message routing
├── types/
│   └── theme.ts                   # TypeScript interfaces
└── utils/
    ├── colorUtils.ts              # Color manipulation utilities
    ├── formatters.ts              # Data formatting functions
    └── clipboard.ts               # Clipboard operations
```

## Testing Strategy

### Unit Tests

- Color extraction accuracy
- Typography analysis correctness
- Spacing calculation precision
- Data formatting validation

### Integration Tests

- Message passing between components
- End-to-end theme extraction flow
- Error handling scenarios
- Performance with large websites

### Manual Testing Sites

- Google.com (clean, minimal design)
- GitHub.com (developer-focused)
- Stripe.com (modern design system)
- Bootstrap documentation (framework detection)
- Tailwind CSS site (utility-first detection)

## Performance Considerations

### Optimization Strategies

- Limit DOM traversal depth
- Cache computed styles
- Debounce rapid extraction requests
- Implement progressive analysis (show results as they come)
- Set reasonable timeouts for analysis

### Memory Management

- Clean up event listeners
- Limit stored data size
- Implement data compression for large themes
- Clear previous results before new extraction

## Error Handling

### Common Error Scenarios

- Page not fully loaded
- Restricted content (CSP violations)
- Very large/complex pages
- Network timeouts
- Permission issues

### Error Recovery

- Graceful degradation for partial data
- Retry mechanisms for transient failures
- Clear error messages for users
- Fallback to basic analysis when advanced fails

## Timeline Estimate

### Week 1-2: Phase 1 (Core Infrastructure)

- Set up message passing
- Basic content script structure
- Enhanced popup UI with loading states

### Week 3-4: Phase 2 (Theme Analysis Engine)

- Color extraction implementation
- Typography analysis
- Basic spacing detection

### Week 5-6: Phase 3 (Advanced Analysis)

- Component recognition
- Framework detection
- CSS custom properties

### Week 7: Phase 4 (Export & Polish)

- Export functionality
- Data formatting
- Testing and bug fixes

## Success Metrics

### Functionality

- ✅ Extracts colors accurately from 95% of websites
- ✅ Identifies typography patterns correctly
- ✅ Detects spacing systems reliably
- ✅ Completes analysis within 3 seconds
- ✅ Handles errors gracefully

### User Experience

- ✅ Intuitive popup interface
- ✅ Clear loading and error states
- ✅ Easy copy/export functionality
- ✅ Responsive design for different screen sizes
- ✅ Accessible for screen readers

This plan provides a structured approach to implementing the theme extraction functionality while maintaining code quality and user experience standards.

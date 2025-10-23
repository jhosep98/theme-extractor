// Type definitions for theme extraction

export interface ColorPalette {
  primary: string[]
  secondary: string[]
  accent: string[]
  neutral: string[]
  background: string[]
  text: string[]
  border: string[]
  all: ColorInfo[]
}

export interface ColorInfo {
  value: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  usage: 'background' | 'text' | 'border' | 'other'
  frequency: number
}

export interface TypographyData {
  fontFamilies: FontFamilyInfo[]
  fontSizes: string[]
  fontWeights: number[]
  lineHeights: string[]
  letterSpacings: string[]
  textTransforms: string[]
}

export interface FontFamilyInfo {
  family: string
  usage: number
  elements: string[]
}

export interface SpacingData {
  margins: string[]
  padding: string[]
  gaps: string[]
  common: string[]
}

export interface ComponentData {
  buttons: ButtonStyle[]
  forms: FormStyle[]
  cards: CardStyle[]
  links: LinkStyle[]
}

export interface ButtonStyle {
  backgroundColor: string
  color: string
  padding: string
  borderRadius: string
  border: string
  fontSize: string
  fontWeight: number
  selector: string
}

export interface FormStyle {
  inputBackground: string
  inputBorder: string
  inputBorderRadius: string
  inputPadding: string
  inputFontSize: string
  focusBorderColor: string
  selector: string
}

export interface CardStyle {
  backgroundColor: string
  border: string
  borderRadius: string
  padding: string
  boxShadow: string
  selector: string
}

export interface LinkStyle {
  color: string
  textDecoration: string
  hoverColor: string
  selector: string
}

export interface MetaData {
  url: string
  title: string
  extractedAt: string
  totalElements: number
  analysisTime: number
}

export interface ThemeData {
  colors: ColorPalette
  typography: TypographyData
  spacing: SpacingData
  components: ComponentData
  metadata: MetaData
}

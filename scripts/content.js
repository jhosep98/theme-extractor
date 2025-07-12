function extractComputedStyles(element, properties) {
  if (!element) return {};
  const styles = window.getComputedStyle(element);
  const result = {};
  properties.forEach((prop) => {
    if (styles[prop]) {
      result[prop] = styles[prop];
    }
  });
  return result;
}

function extractThemeData() {
  const rootElement = document.documentElement;
  const bodyElement = document.body;
  const rootStyles = window.getComputedStyle(rootElement);
  const bodyStyles = window.getComputedStyle(bodyElement);

  const themeData = {
    palette: {
      mode:
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      primary: { main: null },
      secondary: { main: null },
      divider: null,
      background: {
        default: bodyStyles.backgroundColor,
        paper: null,
      },
      text: {
        primary: bodyStyles.color,
        secondary: null,
        disabled: null,
      },
    },
    typography: {
      fontFamily: bodyStyles.fontFamily,
      fontSize: parseFloat(bodyStyles.fontSize), // Base font size
      htmlFontSize: parseFloat(rootStyles.fontSize), // Usually 16px unless specified
      pxToRem: (px) => `${px / parseFloat(rootStyles.fontSize)}rem`, // Helper
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      subtitle1: {},
      subtitle2: {},
      body1: extractComputedStyles(bodyElement, [
        "fontSize",
        "lineHeight",
        "fontWeight",
        "letterSpacing",
      ]),
      body2: {},
      button: {},
      caption: {},
      overline: {},
    },
    shape: {
      borderRadius: "4px", // Default MUI value, will try to infer
    },
    shadows: Array(25).fill("none"), // MUI has 25 shadows, default to none
  };

  // --- Attempt to infer palette colors ---
  const colorRoles = {
    primary: [
      ".MuiButton-containedPrimary",
      ".btn-primary",
      '[data-color="primary"]',
      '[data-testid="primary-button"]',
    ],
    secondary: [
      ".MuiButton-containedSecondary",
      ".btn-secondary",
      '[data-color="secondary"]',
      '[data-testid="secondary-button"]',
    ],
    error: [".MuiAlert-standardError", ".text-danger"],
    warning: [".MuiAlert-standardWarning", ".text-warning"],
    info: [".MuiAlert-standardInfo", ".text-info"],
    success: [".MuiAlert-standardSuccess", ".text-success"],
    textSecondary: [".MuiTypography-colorTextSecondary", ".text-muted"],
    backgroundPaper: [".MuiPaper-root", ".card"],
    divider: [".MuiDivider-root", '[role="separator"]'], // More specific elements
  };

  for (const role in colorRoles) {
    for (const selector of colorRoles[role]) {
      const element = document.querySelector(selector);
      if (element) {
        const style = window.getComputedStyle(element);
        let color = null;
        if (role.startsWith("text")) {
          color = style.color;
        } else if (role === "divider") {
          color = style.borderColor || style.backgroundColor; // Dividers can be border or background
        } else {
          color = style.backgroundColor;
        }

        if (color && color !== "rgba(0, 0, 0, 0)") {
          // Ignore transparent
          if (role === "textSecondary")
            themeData.palette.text.secondary = color;
          else if (role === "backgroundPaper")
            themeData.palette.background.paper = color;
          else if (role === "divider") themeData.palette.divider = color;
          else themeData.palette[role].main = color;
          break; // Found it, move to next role
        }
      }
    }
  }

  // --- Attempt to infer typography variants ---
  const typographyVariants = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: ".MuiTypography-subtitle1",
    subtitle2: ".MuiTypography-subtitle2",
    body2: ".MuiTypography-body2",
    button: "button", // Or .MuiButton-root
    caption: ".MuiTypography-caption",
    overline: ".MuiTypography-overline",
  };

  for (const variant in typographyVariants) {
    const selector = typographyVariants[variant];
    const element = document.querySelector(selector);
    if (element) {
      themeData.typography[variant] = extractComputedStyles(element, [
        "fontSize",
        "lineHeight",
        "fontWeight",
        "letterSpacing",
        "textTransform",
      ]);
    }
  }

  // --- Infer global border radius ---
  const commonRoundedElements = [
    ".MuiButtonBase-root",
    ".MuiPaper-rounded",
    ".MuiCard-root",
    "button",
    ".card",
    "input",
    "textarea",
    "select",
  ];
  for (const selector of commonRoundedElements) {
    const element = document.querySelector(selector);
    if (element) {
      const borderRadius = window.getComputedStyle(element).borderRadius;
      if (borderRadius && borderRadius !== "0px") {
        themeData.shape.borderRadius = borderRadius;
        break;
      }
    }
  }

  // --- Extract CSS Variables (most reliable for design systems) ---
  const cssVariableMap = {
    "--mui-palette-primary-main": "palette.primary.main",
    "--mui-palette-secondary-main": "palette.secondary.main",
    "--mui-palette-text-primary": "palette.text.primary",
    "--mui-palette-text-secondary": "palette.text.secondary",
    "--mui-palette-background-default": "palette.background.default",
    "--mui-palette-background-paper": "palette.background.paper",
    "--mui-palette-divider": "palette.divider",
    "--mui-typography-font-family": "typography.fontFamily",
    "--mui-spacing-unit": "spacing", // Not standard MUI but common in custom themes
    "--mui-shape-border-radius": "shape.borderRadius",
    // Add more as you discover common variable names
    "--primary-color": "palette.primary.main", // Generic primary
    "--secondary-color": "palette.secondary.main", // Generic secondary
  };

  for (const cssVar in cssVariableMap) {
    const value = rootStyles.getPropertyValue(cssVar).trim();
    if (value) {
      const path = cssVariableMap[cssVar].split(".");
      let current = themeData;
      for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          current[path[i]] = value;
        } else {
          current[path[i]] = current[path[i]] || {};
          current = current[path[i]];
        }
      }
    }
  }

  return themeData;
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractTheme") {
    const data = extractThemeData();
    sendResponse({ themeData: data });
    return true;
  }
});

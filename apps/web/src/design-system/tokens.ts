/**
 * FloodGuard AI — Design Tokens
 * Restrained, government-inspired public service and accessible operational tokens.
 */

export const tokens = {
  colors: {
    // Primary Institutional (Government-style)
    navy: {
      950: '#0a1128',
      900: '#0f172a',
      850: '#15203b',
      800: '#1e293b',
      700: '#334155',
      600: '#475569',
    },
    // Backgrounds
    surface: {
      white: '#ffffff',
      offWhite: '#f8fafc',
      neutralLight: '#f1f5f9',
      borderLight: '#e2e8f0',
      borderMuted: '#cbd5e1',
    },
    // Text
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      inverse: '#ffffff',
    },
    // Restrained National/Accent Accents
    accent: {
      saffron: '#d97706', // Muted saffron / orange
      saffronSubtle: '#fef3c7',
      navyBlue: '#1e3a8a',
      green: '#15803d', // Muted tricolour green
      greenSubtle: '#dcfce7',
      tricolor: {
        saffron: '#ff9933',
        white: '#ffffff',
        green: '#138808',
      },
    },
    // Risk & Alerts (Restrained Institutional)
    risk: {
      low: { bg: '#ecfdf5', text: '#15803d', border: '#86efac' },
      moderate: { bg: '#fefce8', text: '#a16207', border: '#fde047' },
      high: { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
      extreme: { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' },
    },
    // Accessibility High Contrast
    highContrast: {
      bg: '#000000',
      surface: '#121212',
      text: '#ffffff',
      yellow: '#ffff00',
      border: '#ffffff',
    }
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Devanagari", sans-serif',
      serif: '"Noto Serif", Georgia, Cambria, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
  },
  radii: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '6px',
    // Deliberately no rounded-3xl or oversized bubbly pill radius in public portal
  },
  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  }
};

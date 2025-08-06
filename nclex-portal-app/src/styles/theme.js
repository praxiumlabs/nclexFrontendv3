// src/styles/theme.js
export const baseTheme = {
  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },

  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
    xxxl: '4rem',    // 64px
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out',
  },

  // Z-index
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },
};

// Light theme colors
export const lightTheme = {
  ...baseTheme,
  name: 'light',
  colors: {
    // Primary colors
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    // Secondary colors
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic colors
    success: {
      light: '#86efac',
      main: '#22c55e',
      dark: '#15803d',
      contrast: '#ffffff',
    },

    error: {
      light: '#fca5a5',
      main: '#ef4444',
      dark: '#b91c1c',
      contrast: '#ffffff',
    },

    warning: {
      light: '#fcd34d',
      main: '#f59e0b',
      dark: '#d97706',
      contrast: '#000000',
    },

    info: {
      light: '#93c5fd',
      main: '#3b82f6',
      dark: '#1e40af',
      contrast: '#ffffff',
    },

    // Background colors
    background: {
      default: '#ffffff',
      paper: '#f9fafb',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Text colors
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
      hint: '#d1d5db',
      contrast: '#ffffff',
    },

    // Border colors
    border: {
      light: '#e5e7eb',
      main: '#d1d5db',
      dark: '#9ca3af',
    },

    // Action colors
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
};

// Dark theme colors
export const darkTheme = {
  ...baseTheme,
  name: 'dark',
  colors: {
    // Primary colors
    primary: {
      50: '#022c22',
      100: '#064e3b',
      200: '#047857',
      300: '#059669',
      400: '#10b981',
      500: '#34d399',
      600: '#6ee7b7',
      700: '#a7f3d0',
      800: '#d1fae5',
      900: '#ecfdf5',
    },

    // Secondary colors
    secondary: {
      50: '#1e3a8a',
      100: '#1e40af',
      200: '#1d4ed8',
      300: '#2563eb',
      400: '#3b82f6',
      500: '#60a5fa',
      600: '#93c5fd',
      700: '#bfdbfe',
      800: '#dbeafe',
      900: '#eff6ff',
    },

    // Gray scale
    gray: {
      50: '#111827',
      100: '#1f2937',
      200: '#374151',
      300: '#4b5563',
      400: '#6b7280',
      500: '#9ca3af',
      600: '#d1d5db',
      700: '#e5e7eb',
      800: '#f3f4f6',
      900: '#f9fafb',
    },

    // Semantic colors
    success: {
      light: '#a7f3d0',
      main: '#34d399',
      dark: '#059669',
      contrast: '#000000',
    },

    error: {
      light: '#fecaca',
      main: '#f87171',
      dark: '#dc2626',
      contrast: '#000000',
    },

    warning: {
      light: '#fed7aa',
      main: '#fb923c',
      dark: '#ea580c',
      contrast: '#000000',
    },

    info: {
      light: '#bfdbfe',
      main: '#60a5fa',
      dark: '#2563eb',
      contrast: '#000000',
    },

    // Background colors
    background: {
      default: '#0f172a',
      paper: '#1e293b',
      elevated: '#334155',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },

    // Text colors
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b',
      hint: '#475569',
      contrast: '#0f172a',
    },

    // Border colors
    border: {
      light: '#334155',
      main: '#475569',
      dark: '#64748b',
    },

    // Action colors
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
};
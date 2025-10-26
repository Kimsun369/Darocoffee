// config/color-config.ts
export type ThemeName = 'amber' | 'red' | 'blue' | 'green' | 'purple' | 'pink';

// JUST CHANGE THIS VARIABLE TO SWITCH THEMES
export const CURRENT_THEME: ThemeName = 'pink'; // Change to 'blue', 'green', etc.

// Theme definitions
const THEMES = {
  amber: {
    primary: {
      50: '#fffbeb',
      100: '#fef3c7', 
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706', // MAIN
      700: '#b45309',
      800: '#92400e', 
      900: '#78350f',
    }
  },
  red: {
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626', // MAIN
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },
  blue: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb', // MAIN
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    }
  },
  green: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a', // MAIN
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    }
  },
  purple: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea', // MAIN
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    }
  },
  pink: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777', // MAIN
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    }
  }
} as const;

// Get dynamic gradient based on current theme
const getThemeGradient = (theme: ThemeName) => {
  const gradients = {
    amber: `linear-gradient(to bottom right, ${THEMES.amber.primary[50]}, ${THEMES.amber.primary[100]})`,
    red: `linear-gradient(to bottom right, ${THEMES.red.primary[50]}, ${THEMES.red.primary[100]})`,
    blue: `linear-gradient(to bottom right, ${THEMES.blue.primary[50]}, ${THEMES.blue.primary[100]})`,
    green: `linear-gradient(to bottom right, ${THEMES.green.primary[50]}, ${THEMES.green.primary[100]})`,
    purple: `linear-gradient(to bottom right, ${THEMES.purple.primary[50]}, ${THEMES.purple.primary[100]})`,
    pink: `linear-gradient(to bottom right, ${THEMES.pink.primary[50]}, ${THEMES.pink.primary[100]})`,
  };
  return gradients[theme];
};

// Function to determine if background is light or dark for text contrast
const getTextColorForBackground = (theme: ThemeName) => {
  // For light gradient backgrounds, use dark text for contrast
  const lightThemes = ['amber', 'blue', 'green', 'pink'];
  return lightThemes.includes(theme) ? '#111827' : '#ffffff';
};

const getSecondaryTextColor = (theme: ThemeName) => {
  const lightThemes = ['amber', 'blue', 'green', 'pink'];
  return lightThemes.includes(theme) ? '#6b7280' : '#d1d5db';
};

const getTertiaryTextColor = (theme: ThemeName) => {
  const lightThemes = ['amber', 'blue', 'green', 'pink'];
  return lightThemes.includes(theme) ? '#9ca3af' : '#9ca3af';
};

// Shared colors (consistent across all themes)
const SHARED = {
  semantic: {
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  background: {
    primary: '#ffffff',
    secondary: '#faf8f5',
    tertiary: '#f0fdfa',
    gradient: getThemeGradient(CURRENT_THEME), // Dynamic gradient based on theme
    menu: getThemeGradient(CURRENT_THEME), // Add this for menu background
    transparentLight: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    primary: getTextColorForBackground(CURRENT_THEME), // Dynamic based on theme
    secondary: getSecondaryTextColor(CURRENT_THEME), // Dynamic based on theme
    tertiary: getTertiaryTextColor(CURRENT_THEME), // Dynamic based on theme
    inverse: '#ffffff',
    inverseLight: 'rgba(255, 255, 255, 0.9)',
    onLight: '#111827', // Always dark for light backgrounds
    onDark: '#ffffff', // Always light for dark backgrounds
  },
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    strong: THEMES[CURRENT_THEME].primary[600], // Dynamic based on theme
  }
};

// Export the final color object
export const COLORS = {
  ...THEMES[CURRENT_THEME],
  ...SHARED,
} as const;
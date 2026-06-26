export type StylistColorScheme = 'light' | 'dark';
export type StylistColorMode = 'bg' | 'automatic';
export type StylistFamilyMode = 'one' | 'two';

export interface StylistColorPalette {
  background: string;
  surface: string;
  text: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
}

export interface StylistSemanticFamilies {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
}

export interface StylistThemeTokens {
  version: 1;
  colorSystem: {
    mode: StylistColorMode;
    previewScheme: StylistColorScheme;
    familyMode: StylistFamilyMode;
  };
  families: {
    light: StylistSemanticFamilies;
    dark: StylistSemanticFamilies;
  };
  palettes: {
    bg: {
      light: StylistColorPalette;
      dark: StylistColorPalette;
    };
    automatic: {
      light: StylistColorPalette;
      dark: StylistColorPalette;
    };
  };
  colors: {
    light: StylistColorPalette;
    dark: StylistColorPalette;
  };
  typography: {
    fontFamily: string;
    fontDisplay: string;
    fontTitle: string;
    fontSubtitle: string;
    fontBody: string;
    fontCaption: string;
    fontMono: string;
    displaySize: number;
    headingSize: number;
    bodySize: number;
    captionSize: number;
  };
  layout: {
    radius: number;
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}

export const stylistThemeTokens: StylistThemeTokens = {
  version: 1,
  colorSystem: {
    mode: 'bg',
    previewScheme: 'light',
    familyMode: 'one',
  },
  families: {
    light: {
      primary: 'blue',
      secondary: 'orange',
      success: 'emerald',
      warning: 'amber',
    },
    dark: {
      primary: 'blue',
      secondary: 'orange',
      success: 'emerald',
      warning: 'amber',
    },
  },
  palettes: {
    bg: {
      light: {
        background: '#f8fafc',
        surface: '#e2e8f0',
        text: '#111827',
        primary: '#299a0f',
        secondary: '#b85d13',
        success: '#16a34a',
        warning: '#f97316',
      },
      dark: {
        background: '#09090b',
        surface: '#18181b',
        text: '#f8fafc',
        primary: '#299a0f',
        secondary: '#d48a45',
        success: '#4ade80',
        warning: '#fb923c',
      },
    },
    automatic: {
      light: {
        background: '#f5f9ff',
        surface: '#e7f0fe',
        text: '#132a4f',
        primary: '#3b82f6',
        secondary: '#b85d13',
        success: '#10b981',
        warning: '#f59e0b',
      },
      dark: {
        background: '#132132',
        surface: '#1f3550',
        text: '#d6e8fe',
        primary: '#60a5fa',
        secondary: '#d48a45',
        success: '#34d399',
        warning: '#fbbf24',
      },
    },
  },
  colors: {
    light: {
      background: '#f8fafc',
      surface: '#e2e8f0',
      text: '#111827',
      primary: '#299a0f',
      secondary: '#b85d13',
      success: '#16a34a',
      warning: '#f97316',
    },
    dark: {
      background: '#09090b',
      surface: '#18181b',
      text: '#f8fafc',
      primary: '#299a0f',
      secondary: '#d48a45',
      success: '#4ade80',
      warning: '#fb923c',
    },
  },
  typography: {
    fontFamily: 'System',
    fontDisplay: 'Yellowtail',
    fontTitle: 'System',
    fontSubtitle: 'System',
    fontBody: 'System',
    fontCaption: 'System',
    fontMono: 'monospace',
    displaySize: 32,
    headingSize: 20,
    bodySize: 15,
    captionSize: 12,
  },
  layout: {
    radius: 12,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },
};

export default stylistThemeTokens;

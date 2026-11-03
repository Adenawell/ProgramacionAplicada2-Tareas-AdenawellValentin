import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#141412',
    background: '#F9F8F6',
    backgroundElement: '#EFECE6',
    backgroundSelected: '#E3DFD5',
    textSecondary: '#6B675D',
  },
  dark: {
    text: '#F4F1DE',
    background: '#141412',
    backgroundElement: '#1E1F1C',
    backgroundSelected: '#2C2E29',
    textSecondary: '#A9A596',
    primary: '#81B29A',         
    danger: '#E07A5F',          
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
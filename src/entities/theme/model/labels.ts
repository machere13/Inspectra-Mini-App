import type { ThemeKey } from './types';

export const THEME_LABELS: Record<ThemeKey, string> = {
  dark: 'Тёмная',
  white: 'Светлая',
  void: 'Пустота',
  purple: 'Фиолетовая',
  chrome: 'Хром',
  'ocean-blue': 'Океанская',
  vampire: 'Вампир',
  'acid-green': 'Кислотная',
  neon: 'Неон',
  pink: 'Розовая',
};

export const THEME_COLORS: Record<ThemeKey, string> = {
  dark: '#1a1a1a',
  white: '#ffffff',
  void: '#000000',
  purple: '#6a1b9a',
  chrome: '#9e9e9e',
  'ocean-blue': '#0277bd',
  vampire: '#5d0202',
  'acid-green': '#76ff03',
  neon: '#00e5ff',
  pink: '#ec407a',
};

export const getThemeLabel = (k: ThemeKey): string => THEME_LABELS[k] ?? k;
export const getThemeColor = (k: ThemeKey): string => THEME_COLORS[k] ?? '#808080';

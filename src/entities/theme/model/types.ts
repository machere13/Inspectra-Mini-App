export type ThemeKey =
  | 'dark'
  | 'white'
  | 'void'
  | 'purple'
  | 'chrome'
  | 'ocean-blue'
  | 'vampire'
  | 'acid-green'
  | 'neon'
  | 'pink';

export interface ThemeCatalogEntry {
  key: ThemeKey;
  unlocked: boolean;
  unlock_via: { achievement_name: string; description: string } | null;
}

export interface ThemesBundle {
  current: ThemeKey;
  all: ThemeKey[];
  unlocked: ThemeKey[];
  catalog: ThemeCatalogEntry[];
}

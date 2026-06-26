import { z } from 'zod';

export const themeKeySchema = z.enum([
  'dark',
  'white',
  'void',
  'purple',
  'chrome',
  'ocean-blue',
  'vampire',
  'acid-green',
  'neon',
  'pink',
]);

export const themeCatalogEntrySchema = z.object({
  key: themeKeySchema,
  unlocked: z.boolean(),
  unlock_via: z
    .object({
      achievement_name: z.string(),
      description: z.string(),
    })
    .nullable(),
});

export const themesBundleSchema = z.object({
  current: themeKeySchema,
  all: z.array(themeKeySchema),
  unlocked: z.array(themeKeySchema),
  catalog: z.array(themeCatalogEntrySchema),
});

export type ThemeKey = z.infer<typeof themeKeySchema>;
export type ThemeCatalogEntry = z.infer<typeof themeCatalogEntrySchema>;
export type ThemesBundle = z.infer<typeof themesBundleSchema>;

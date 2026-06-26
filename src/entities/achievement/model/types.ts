import { z } from 'zod';

export const achievementCategorySchema = z.enum([
  'registration',
  'content_viewing',
  'dev_diving',
  'legacy',
  'it_errors',
  'it_security',
  'general',
]);

export const achievementGroupSchema = z.object({
  key: z.string(),
  category: achievementCategorySchema,
  name: z.string(),
  description: z.string(),
  progress: z.number(),
  target: z.number(),
  tiers_total: z.number(),
  tiers_completed: z.number(),
  all_completed: z.boolean(),
});

export const badgeSchema = z.object({
  label: z.string(),
  achievement_name: z.string(),
});

export type AchievementCategory = z.infer<typeof achievementCategorySchema>;
export type AchievementGroup = z.infer<typeof achievementGroupSchema>;
export type Badge = z.infer<typeof badgeSchema>;

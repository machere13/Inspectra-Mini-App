import { z } from 'zod';
import { achievementGroupSchema, badgeSchema } from '@entities/achievement/@x/profile';
import { themesBundleSchema } from '@entities/theme/@x/profile';
import { titlesBundleSchema } from '@entities/title/@x/profile';
import { userSchema } from '@entities/user/@x/profile';

export const levelInfoSchema = z.object({
  number: z.number(),
  name: z.string(),
  required_xp: z.number(),
});

export const progressBundleSchema = z.object({
  level: levelInfoSchema.nullable(),
  next_level: levelInfoSchema.nullable(),
  level_progress_percent: z.number(),
});

export const skillChartRowSchema = z.object({
  key: z.string(),
  label: z.string(),
  percent: z.number(),
  done: z.number(),
  total: z.number(),
});

export const profileBundleSchema = z.object({
  user: userSchema,
  progress: progressBundleSchema,
  skill_chart: z.array(skillChartRowSchema),
  achievements: z.array(achievementGroupSchema),
  titles: titlesBundleSchema,
  themes: themesBundleSchema,
  badges: z.array(badgeSchema),
});

export type LevelInfo = z.infer<typeof levelInfoSchema>;
export type ProgressBundle = z.infer<typeof progressBundleSchema>;
export type SkillChartRow = z.infer<typeof skillChartRowSchema>;
export type ProfileBundle = z.infer<typeof profileBundleSchema>;

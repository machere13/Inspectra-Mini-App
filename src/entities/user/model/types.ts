import { z } from 'zod';
import { themeKeySchema } from '@entities/theme/@x/user';

export const gameRoleSchema = z.enum(['mage', 'warrior', 'priest', 'hunter']).nullable();

export const userShortSchema = z.object({
  id: z.number(),
  email: z.string().nullable(),
  game_role: gameRoleSchema,
  game_role_required: z.boolean(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  game_role: gameRoleSchema,
  game_role_label: z.string().nullable(),
  game_role_required: z.boolean(),
  theme: themeKeySchema,
  notifications_email: z.boolean(),
  experience_points: z.number(),
});

export type GameRole = z.infer<typeof gameRoleSchema>;
export type UserShort = z.infer<typeof userShortSchema>;
export type User = z.infer<typeof userSchema>;

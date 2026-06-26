import { z } from 'zod';

export const articleSchema = z.object({
  id: z.number(),
  week_id: z.number().optional(),
  title: z.string(),
  description: z.string().nullable(),
  body: z.string(),
  tags: z.array(z.string()).default([]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Article = z.infer<typeof articleSchema>;

import { z } from 'zod';

export const titleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
});

export const titlesBundleSchema = z.object({
  current: titleSchema.nullable(),
  available: z.array(titleSchema),
});

export type Title = z.infer<typeof titleSchema>;
export type TitlesBundle = z.infer<typeof titlesBundleSchema>;

import { z } from 'zod';

export const weekSchema = z.object({
  id: z.number(),
  number: z.number(),
  title: z.string(),
  description: z.string().nullable(),
});

export type Week = z.infer<typeof weekSchema>;

import { z } from 'zod';

export const apiSuccessSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    data,
    message: z.string().optional(),
  });

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.string()).optional(),
  }),
});

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = z.infer<typeof apiErrorSchema>;

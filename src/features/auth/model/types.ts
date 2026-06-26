import { z } from 'zod';
import { userShortSchema } from '@entities/user';

export const loginRegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginRegisterResponseSchema = z.object({
  requires_verification: z.literal(true),
  email: z.string(),
});

export const verifyEmailRequestSchema = z.object({
  email: z.string(),
  code: z.string().min(1),
});

export const verifyEmailResponseSchema = z.object({
  token: z.string(),
  user: userShortSchema,
});

export const resendCodeRequestSchema = z.object({
  email: z.string(),
});

export type LoginRegisterRequest = z.infer<typeof loginRegisterRequestSchema>;
export type LoginRegisterResponse = z.infer<typeof loginRegisterResponseSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
export type ResendCodeRequest = z.infer<typeof resendCodeRequestSchema>;

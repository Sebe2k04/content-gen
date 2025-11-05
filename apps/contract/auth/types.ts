import { z } from "zod";

export const userPayload = z.object({
  id: z.string(),
  email: z.string().email(),
});

export const successAuthResponseSchema = z.object({
  accessToken: z.string(),
  user: userPayload,
});

export const signupSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const verifyEmailOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

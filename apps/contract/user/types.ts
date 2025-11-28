import { z } from "zod";
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
});

export const userSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().nullable(),
});
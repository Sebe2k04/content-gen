// src/contract/portfolio/types.ts
import { z } from "zod";
import { IntegrationProvider, SkillLevel } from "../enum";

export const integrationSchema = z.object({
  id: z.string().optional(), // server id
  provider: z.nativeEnum(IntegrationProvider),
  profileUrl: z.string().url(),
  username: z.string().nullable(),
  meta: z.record(z.any()).optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullable(),
  repoUrl: z.string().url().nullable(),
  demoUrl: z.string().url().nullable(),
  technologies: z.array(z.string()).optional(),
  highlight: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  level: z.nativeEnum(SkillLevel),
  tags: z.array(z.string()).optional(),
});

export const themeSchema = z.object({
  id: z.string().optional(),
  key: z.string(), // e.g. "minimal", "dark", "two-column"
  displayName: z.string(),
  settings: z.record(z.any()).optional(), // JSON theme options
});

export const resumeUploadResponse = z.object({
  resumeId: z.string(),
  extracted: z
    .object({
      name: z.string().nullable(),
      email: z.string().nullable(),
      phone: z.string().nullable(),
      summary: z.string().nullable(),
      skills: z.array(z.string()).optional(),
      education: z.array(z.any()).optional(),
      experience: z.array(z.any()).optional(),
    })
    .optional(),
});

export const portfolioPublicResponse = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  headline: z.string().nullable(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  integrations: z.array(integrationSchema),
  theme: themeSchema.nullable(),
  resumeUrl: z.string().nullable(),
});

export const createPortfolioSchema = z.object({
  name: z.string(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().nullable(),
});

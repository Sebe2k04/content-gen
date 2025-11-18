// src/contract/portfolio/contract.ts
import { initContract } from "@ts-rest/core";
import {
  integrationSchema, projectSchema, skillSchema, themeSchema,
  resumeUploadResponse, portfolioPublicResponse
} from "./types";
import { successResponseSchema } from "../common"; // your common
import z from "zod";

const c = initContract();

export const portfolioContract = c.router({
  // Protected routes (user's own portfolio)
  uploadResume: {
    method: "POST",
    path: "/resume/upload",
    body: z.any(),
    contentType: "multipart/form-data",
    responses: { 200: resumeUploadResponse },
  },
  saveManualData: {
    method: "POST",
    path: "/manual",
    body: z.object({
      name: z.string().optional(),
      headline: z.string().optional(),
      bio: z.string().optional(),
      avatarUrl: z.string().nullable()
    }),
    responses: { 200: successResponseSchema },
  },
  addProject: {
    method: "POST",
    path: "/projects",
    body: projectSchema,
    responses: { 200: successResponseSchema },
  },
  updateProject: {
    method: "PUT",
    path: "/projects/:id",
    body: projectSchema,
    responses: { 200: successResponseSchema },
  },
  deleteProject: {
    method: "DELETE",
    path: "/projects/:id",
    responses: { 200: successResponseSchema },
  },
  addSkill: {
    method: "POST",
    path: "/skills",
    body: skillSchema,
    responses: { 200: successResponseSchema },
  },
  upsertIntegration: {
    method: "POST",
    path: "/integrations",
    body: integrationSchema,
    responses: { 200: successResponseSchema },
  },
  setTheme: {
    method: "POST",
    path: "/theme",
    body: themeSchema,
    responses: { 200: successResponseSchema },
  },

  // Public endpoint
  getPublicPortfolio: {
    method: "GET",
    path: "/public",
    query: z.object({
      userId: z.string(),
    }),
    responses: { 200: portfolioPublicResponse },
  }
}, { pathPrefix: "/portfolio" });

export type PortfolioContract = typeof portfolioContract;

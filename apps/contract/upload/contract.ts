import { initContract } from "@ts-rest/core";
import { MediaUploadResponseSchema } from "./types";
import z from "zod";

const c = initContract();

export const uploadContract = c.router(
  {
    uploadMedia: {
      method: "POST",
      path: "/media",
      contentType: "multipart/form-data",
      body: z.object({
        files: z.custom<File[]>(),
      }),
      responses: {
        200: MediaUploadResponseSchema,
      },
    },
  },
  {
    pathPrefix: "/upload",
  }
);

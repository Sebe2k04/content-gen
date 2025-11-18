import { initContract } from "@ts-rest/core";
import { uploadBodySchema, uploadResponseSchema } from "./types";

const c = initContract();

export const uploadContract = c.router(
  {
    uploadFile: {
      method: "POST",
      path: "/file",
      body: uploadBodySchema,
      responses: {
        200: uploadResponseSchema,
      },
    },
  },
  {
    pathPrefix: "/upload",
  }
);

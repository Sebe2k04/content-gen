import { initContract } from "@ts-rest/core";
import { userResponseSchema, userSchema } from "./types";
import { successResponseSchema } from "../common";

const c = initContract();

export const userContract = c.router(
  {
    getProfile: {
      method: "GET",
      path: "/profile",
      responses: {
        200: userResponseSchema,
      },
    },
    updateProfile: {
      method: "POST",
      path: "/profile",
      body: userSchema,
      responses: {
        200: successResponseSchema,
      },
    },
  },
  {
    pathPrefix: "/user",
  }
);

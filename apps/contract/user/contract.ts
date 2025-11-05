import { initContract } from "@ts-rest/core"
import { z } from "zod"

const c = initContract()

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/user",
    body: z.object({ name: z.string() }),
    responses: {
      201: z.object({
        id: z.string(),
        name: z.string(),
      })
    }
  }
})

import z from "zod"

export const successResponseSchema = z.object({
    message: z.string(),
})
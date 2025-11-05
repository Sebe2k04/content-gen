import { z } from "zod"

export const CreateUserInput = z.object({
  name: z.string()
})

export const UserOutput = z.object({
  id: z.string(),
  name: z.string()
})

export type CreateUserInput = z.infer<typeof CreateUserInput>
export type UserOutput = z.infer<typeof UserOutput>



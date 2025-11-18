import { MediaType } from "contract/enum";
import { z } from "zod";


export const uploadBodySchema = z.object({
  mediaType: z.nativeEnum(MediaType),
});

export const uploadResponseSchema = z.object({
  name: z.string(),
  mimeType: z.string(),
  mediaType: z.nativeEnum(MediaType),
  url: z.string().url(),
  secureUrl: z.string().url(),
  size: z.number(),
  cloudinaryPublicId: z.string(),
});

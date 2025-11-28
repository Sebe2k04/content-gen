import { MediaType } from "contract/enum";
import { z } from "zod";




export const UploadDataSchema = z.object({
  url: z.string(),
  key: z.string(),
  type: z.nativeEnum(MediaType),
  isUploaded: z.boolean(),
  message: z.string(),
});
export const MediaUploadResponseSchema = z.object({
  data: z.array(UploadDataSchema),
});

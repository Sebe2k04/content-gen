import { em } from "src/db";
import { cloudinary } from "src/common/utils/cloudinary";
import { BadRequestException } from "src/exceptions/http.exception";
import { ServerInferRequest } from "@ts-rest/core";
import { contract } from "contract";
import { MediaType } from "contract/enum";

type EmType = typeof em;

export class UploadService {
  private static instance: UploadService;
  private em: Awaited<ReturnType<EmType["get"]>>;

  private constructor(private dbEm: EmType) {
    this.em = null as any;
  }

  static async getInstance() {
    if (!UploadService.instance) {
      const instance = new UploadService(em);
      await instance.init();
      UploadService.instance = instance;
    }
    return UploadService.instance;
  }

  private async init() {
    this.em = await this.dbEm.get();
  }

  async uploadFile(
    data: ServerInferRequest<typeof contract.upload.uploadFile>["body"],
    file: { filename: string; mimetype: string; buffer: Buffer; size: number }
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const getResourceType = (mediaType: string) => {
      if (mediaType === MediaType.DOCUMENT || mediaType === MediaType.PDF) {
        return 'raw';
      }
      return mediaType as 'image' | 'video';
    };

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: getResourceType(data.mediaType),
          folder: `uploads/${data.mediaType}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });
    const uploadEntity = {
      name: file.filename,
      mimeType: file.mimetype,
      mediaType: data.mediaType,
      url: result.url,
      secureUrl: result.secure_url,
      size: file.size,
      cloudinaryPublicId: result.public_id,
    };
    return uploadEntity;
  }
}

export async function getUploadService() {
  return UploadService.getInstance();
}

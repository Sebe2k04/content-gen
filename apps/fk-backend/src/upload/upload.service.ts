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

  // NO mediaType in body!
  async uploadFile(
    _data: ServerInferRequest<typeof contract.upload.uploadMedia>["body"],
    files: { filename: string; mimetype: string; buffer: Buffer; size: number }[]
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files uploaded");
    }

    // Detect Cloudinary resource type
    const detectResourceType = (mime: string): "image" | "video" | "raw" => {
      if (mime.startsWith("image/")) return "image";
      if (mime.startsWith("video/")) return "video";
      return "raw"; // pdf, docx, etc.
    };

    // Detect your own MediaType enum
    const detectMediaType = (mime: string): MediaType => {
      if (mime.startsWith("image/")) return MediaType.IMAGE;
      if (mime.startsWith("video/")) return MediaType.VIDEO;
      if (mime === "application/pdf") return MediaType.PDF;
      return MediaType.DOCUMENT;
    };

    const uploadResults: {
      name: string;
      mimeType: string;
      mediaType: MediaType;
      url: string;
      secureUrl: string;
      size: number;
      cloudinaryPublicId: string;
    }[] = [];

    for (const file of files) {
      const mediaType = detectMediaType(file.mimetype);
      const resource_type = detectResourceType(file.mimetype);

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type,
            folder: `uploads/${mediaType}`,
          },
          (error, output) => {
            if (error) return reject(error);
            resolve(output);
          }
        );

        uploadStream.end(file.buffer);
      });

      uploadResults.push({
        name: file.filename,
        mimeType: file.mimetype,
        mediaType,
        url: result.url,
        secureUrl: result.secure_url,
        size: file.size,
        cloudinaryPublicId: result.public_id,
      });
    }

    return uploadResults;
  }
}

export async function getUploadService() {
  return UploadService.getInstance();
}

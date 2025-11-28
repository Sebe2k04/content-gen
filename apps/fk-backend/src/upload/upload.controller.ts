import { initServer } from "@ts-rest/fastify";
import { FastifyInstance } from "fastify";
import { contract } from "contract";
import { JwtGuard } from "../common/guards/jwt.guard";
import { getUploadService } from "./upload.service";

const s = initServer();

export const uploadController = (app: FastifyInstance) => {
  const jwtGuard = JwtGuard(app);

  return s.router(contract.upload, {
    uploadMedia: {
      handler: async ({ body, request, reply }) => {
        const fileParts = await request.saveRequestFiles();

        if (!fileParts || fileParts.length === 0) {
          return reply.status(400).send({ message: "Files are required" });
        }

        const files = await Promise.all(
          fileParts.map(async (fp) => ({
            filename: fp.filename,
            mimetype: fp.mimetype,
            buffer: await fp.toBuffer(),
            size: fp.file.bytesRead ?? 0,
          }))
        );

        const service = await getUploadService();
        const output = await service.uploadFile(body, files);

        return {
          status: 200,
          body: {
            data: output.map((file) => ({
              message: `File ${file.name} uploaded successfully`,
              type: file.mediaType,
              key: file.cloudinaryPublicId,
              url: file.url,
              isUploaded: true,
            })),
          },
        };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },
  });
};

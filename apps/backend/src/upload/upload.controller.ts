import { initServer } from "@ts-rest/fastify";
import { FastifyInstance } from "fastify";
import { contract } from "contract";
import { JwtGuard } from "../common/guards/jwt.guard";
import { getUploadService } from "./upload.service";

const s = initServer();

export const uploadController = (app: FastifyInstance) => {
  const jwtGuard = JwtGuard(app);

  return s.router(contract.upload, {
    uploadFile: {
      handler: async ({ body, request, reply }) => {
        const mp = await request.file();
        if (!mp) {
          return reply.status(400).send({ message: "File is required" });
        }

        const fileBuffer = await mp.toBuffer();

        const service = await getUploadService();
        const output = await service.uploadFile(body, {
          filename: mp.filename,
          mimetype: mp.mimetype,
          buffer: fileBuffer,
          size: mp.file.bytesRead ?? 0,
        });

        return { status: 200, body: output };
      },
      hooks: {
        preHandler: jwtGuard.preHandler,
      },
    },
  });
};

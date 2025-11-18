import { FastifyInstance } from "fastify";
import { uploadController } from "./upload.controller";
import { initServer } from "@ts-rest/fastify";

const s = initServer();

export const uploadModule = async (app: FastifyInstance) => {
  app.register(s.plugin(uploadController(app)), {
    responseValidation: true,
  });
};

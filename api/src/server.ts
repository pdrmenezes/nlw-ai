import { fastify } from "fastify";
import { getPromptsRoute } from "./routes/get-prompts";
import { uploadVideoRoute } from "./routes/upload-video";

const api = fastify();

api.register(getPromptsRoute);
api.register(uploadVideoRoute);

api
  .listen({
    port: 3333,
  })
  .then((url) => console.log(`HTTP Server Running on: ${url}`));

import { fastify } from "fastify";
import { getPromptsRoute } from "./routes/get-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";

const api = fastify();

api.register(getPromptsRoute);
api.register(uploadVideoRoute);
api.register(createTranscriptionRoute);

api
  .listen({
    port: 3333,
  })
  .then((url) => console.log(`HTTP Server Running on: ${url}`));

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getPromptsRoute } from "./routes/get-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";

const api = fastify();

api.register(fastifyCors, {
  origin: "*",
});

api.register(getPromptsRoute);
api.register(uploadVideoRoute);
api.register(createTranscriptionRoute);
api.register(generateAICompletionRoute);

api
  .listen({
    port: 3333,
  })
  .then((url) => console.log(`HTTP Server Running on: ${url}`));

import { fastify } from "fastify";
import { getPromptsRoute } from "./routes/get-prompts";

const api = fastify();

api.register(getPromptsRoute);

api
  .listen({
    port: 3333,
  })
  .then((url) => console.log(`HTTP Server Running on: ${url}`));

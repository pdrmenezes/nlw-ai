import { fastify } from "fastify";
import { prisma } from "./lib/prisma";

const api = fastify();

api.get("/prompts", async () => {
  const prompts = await prisma.prompt.findMany({});
  return prompts;
});

api
  .listen({
    port: 3333,
  })
  .then((url) => console.log(`HTTP Server Running on: ${url}`));

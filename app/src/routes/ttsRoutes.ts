import type { FastifyInstance } from "fastify";
import { createSpeech } from "../controllers/ttsController.js";

export default async function ttsRoutes(fastify: FastifyInstance) {
  fastify.post("/api/tts", createSpeech);
}

import type { FastifyReply, FastifyRequest } from "fastify";
import OpenAI from "openai";

interface TTSRequestBody {
  text: string;
  model?: string;
  voice?: string;
  instructions?: string;
}

export const createSpeech = async (
  request: FastifyRequest<{ Body: TTSRequestBody }>,
  reply: FastifyReply,
) => {
  const {
    text,
    model = "gpt-4o-mini-tts",
    voice = "coral",
    instructions,
  } = request.body;

  if (!text || typeof text !== "string") {
    return reply.code(400).send({ error: "Text is required" });
  }

  if (!request.server.env.OPENAI_API_KEY) {
    return reply.code(500).send({ error: "OpenAI API key not configured" });
  }

  try {
    const openai = new OpenAI({
      apiKey: request.server.env.OPENAI_API_KEY,
    });

    const speechParams: any = {
      model,
      voice,
      input: text,
      instructions: `
      Voice: Clear, authoritative, and composed, projecting confidence and professionalism.

Tone: Neutral and informative, maintaining a balance between formality and approachability.

Punctuation: Structured with commas and pauses for clarity, ensuring information is digestible and well-paced.

Delivery: Steady and measured, with slight emphasis on key figures and deadlines to highlight critical points.`,
    };

    const mp3 = await openai.audio.speech.create(speechParams);
    const buffer = Buffer.from(await mp3.arrayBuffer());

    reply.type("audio/mpeg");
    reply.header("Content-Length", buffer.length);
    reply.header("Content-Disposition", "attachment; filename=speech.mp3");

    return reply.send(buffer);
  } catch (error) {
    request.log.error("TTS Error:", error);
    return reply.code(500).send({ error: "Failed to generate speech" });
  }
};

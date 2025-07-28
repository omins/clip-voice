import fastifyEnv from "@fastify/env";
import fp from "fastify-plugin";
import * as z from "zod";

const schema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  VITE_API_URL: z.string().default("/api"),
});

const jsonSchema = z.toJSONSchema(schema, { target: "draft-7" });

declare module "fastify" {
  interface FastifyInstance {
    env: z.infer<typeof schema>;
  }
}

export default fp(
  async (app) => {
    app.register(fastifyEnv, {
      confKey: "env",
      schema: jsonSchema,
    });
  },
  {
    name: "app.env",
  },
);

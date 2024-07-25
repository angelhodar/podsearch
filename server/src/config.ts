import { config } from "dotenv";
import { z } from "zod";

config()

// Define a Zod schema for the environment variables
const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_URL: z.string(),
  MAX_SEGMENT_DURATION: z.coerce.number().default(600),
  GROQ_API_KEY: z.string(),
  GROQ_MODEL: z.string().default("whisper-large-v3"),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET: z.string().default("podsearch"),
});

// Parse and validate process.env using the schema
const configData = configSchema.safeParse(process.env);

if (!configData.success) {
  console.error("Invalid environment variables:", configData.error.format());
  process.exit(1);
}

export default configData.data

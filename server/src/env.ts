import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  GEMINI_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);

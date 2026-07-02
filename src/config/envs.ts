import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().min(1, 'PORT is required.').transform(Number),
  ALLOWED_ORIGINS: z
    .string()
    .min(1, 'ALLOWED_ORIGINS is required.')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required.'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required.'),
  NODE_ENV: z.string().nonempty('NODE_ENV is required.'),
});

type envType = z.infer<typeof envSchema>;

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('Config validation error:', envParsed.error.format());
  throw new Error('Invalid environment variables');
}

export const envs: envType = {
  PORT: envParsed.data.PORT,
  ALLOWED_ORIGINS: envParsed.data.ALLOWED_ORIGINS,
  DATABASE_URL: envParsed.data.DATABASE_URL,
  JWT_SECRET: envParsed.data.JWT_SECRET,
  JWT_REFRESH_SECRET: envParsed.data.JWT_REFRESH_SECRET,
  NODE_ENV: envParsed.data.NODE_ENV,
};

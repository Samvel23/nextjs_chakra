import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

const validateEnv = () => {
  const parsed = envSchema.safeParse(processEnv);
  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 2),
    );
    throw new Error("Invalid environment configuration.");
  }
  return parsed.data;
};

export const env = validateEnv();

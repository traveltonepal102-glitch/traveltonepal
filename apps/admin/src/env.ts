import { z } from "zod";

const envSchema = z.object({
  DATABASE_URI: z.url({ protocol: /^postgres(ql)?$/, error: "must be a postgres:// connection string" }),
  PAYLOAD_SECRET: z.string().min(32, "must be at least 32 characters (openssl rand -hex 32)"),
  TOTP_ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-f]{64}$/i, "must be 64 hex characters (openssl rand -hex 32)"),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (result.success) return result.data;

  const problems = result.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables in apps/admin:\n${problems.join("\n")}`);
};

export const env = parseEnv();

import "server-only";
import { APP_ENVIRONMENTS } from "@ttn/config/appEnvironment";
import { REVALIDATE_SECRET_MIN_LENGTH } from "@ttn/config/websiteCache";
import { z } from "zod";

/** An optional setting: empty (`NAME=` in .env) counts as not set. */
const optional = <Schema extends z.ZodType>(schema: Schema) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

/** No dots: a dotted name breaks the bucket's https address. */
const bucketName = z.string().regex(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/, "must be an S3 bucket name without dots");

// Server-only: the browser never talks to Supabase, so none of these are NEXT_PUBLIC_.
const envSchema = z.object({
  SUPABASE_URL: z.url({ protocol: /^https$/, error: "must be the https:// project URL" }),
  SUPABASE_PUBLISHABLE_KEY: z.string().startsWith("sb_publishable_", "must be the publishable key (sb_publishable_…)"),
  /** Bypasses Row Level Security. Used only for the sign-in lock (src/lib/supabase/admin.ts). */
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_", "must be a secret key (sb_secret_…)"),
  /** Optional: the main website, for the "View website" link and for refreshing it after a save (with REVALIDATE_SECRET). */
  WEBSITE_URL: optional(z.url({ protocol: /^https?$/, error: "must be an http(s) URL" })),
  /**
   * Optional: where the sized photos are public, without a trailing slash (production: the CloudFront
   * address, e.g. https://images.traveltonepal.com). Empty: Supabase Storage's public "photos" bucket.
   */
  PHOTOS_PUBLIC_URL: optional(z.url({ protocol: /^https$/, error: "must be an https:// URL" })),
  /**
   * Optional: the password the website's refresh route expects (the same value in apps/web). With WEBSITE_URL,
   * a save shows on the website at once; without, within the hour.
   */
  REVALIDATE_SECRET: optional(
    z.string().min(REVALIDATE_SECRET_MIN_LENGTH, `must be at least ${REVALIDATE_SECRET_MIN_LENGTH} characters`),
  ),
  /** "production" turns on production-only features (read with appEnvironment()); not set: development. */
  NEXT_PUBLIC_APP_ENV: optional(z.enum(APP_ENVIRONMENTS, "must be production or development")),
  /**
   * Optional, all or none: photos and trek files in one S3 bucket instead of Supabase Storage. The keys are an
   * IAM user's, allowed only to put, get and delete objects in it. Not AWS_ACCESS_KEY_ID: Vercel reserves the
   * AWS_ names.
   */
  S3_REGION: optional(z.string().regex(/^[a-z]{2}(-[a-z]+)+-\d+$/, "must be an AWS region, e.g. ap-southeast-2")),
  S3_BUCKET: optional(bucketName),
  S3_ACCESS_KEY_ID: optional(z.string().regex(/^A[KS]IA[A-Z0-9]{16}$/, "must be an IAM access key ID (AKIA…)")),
  S3_SECRET_ACCESS_KEY: optional(z.string().min(1)),
});

type EnvValues = z.infer<typeof envSchema>;

const S3_VARIABLES = ["S3_REGION", "S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"] as const;

/** Half an S3 setup would upload to one place and show photos from another: all four or none. */
const checkS3 = (values: EnvValues, context: z.RefinementCtx) => {
  const missing = S3_VARIABLES.filter((name) => !values[name]);
  if (missing.length === S3_VARIABLES.length) return;

  for (const name of missing) context.addIssue({ code: "custom", path: [name], message: "needed with the other S3_ settings" });
  if (!values.PHOTOS_PUBLIC_URL) {
    context.addIssue({ code: "custom", path: ["PHOTOS_PUBLIC_URL"], message: "needed with S3: the CloudFront address of S3_BUCKET" });
  }
};

const toSettings = ({ S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, ...rest }: EnvValues) => ({
  ...rest,
  /** Where photos and trek files are stored: S3, or null for Supabase Storage. */
  s3:
    S3_REGION && S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
      ? {
          region: S3_REGION,
          bucket: S3_BUCKET,
          credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
        }
      : null,
});

const parseEnv = () => {
  const result = envSchema.superRefine(checkS3).transform(toSettings).safeParse(process.env);
  if (result.success) return result.data;

  const problems = result.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables in apps/admin:\n${problems.join("\n")}`);
};

export const env = parseEnv();

export type S3Settings = NonNullable<typeof env.s3>;

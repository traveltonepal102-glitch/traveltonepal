import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const BASE = { SUPABASE_URL: "https://abc.supabase.co", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_x", SUPABASE_SECRET_KEY: "sb_secret_x" };

const S3 = {
  S3_REGION: "ap-southeast-2",
  S3_BUCKET: "ttn-photos-prod",
  S3_ACCESS_KEY_ID: "AKIAABCDEFGHIJKLMNOP",
  S3_SECRET_ACCESS_KEY: "secret",
  PHOTOS_PUBLIC_URL: "https://dakut86vbc8x.cloudfront.net",
};

const S3_NAMES = Object.keys(S3);

/** env.ts read with these settings (it reads process.env once, when first imported). */
const loadEnv = async (settings: Record<string, string>) => {
  for (const name of [...Object.keys(BASE), ...S3_NAMES, "WEBSITE_URL", "REVALIDATE_SECRET"]) vi.stubEnv(name, "");
  for (const [name, value] of Object.entries({ ...BASE, ...settings })) vi.stubEnv(name, value);
  vi.resetModules();
  return (await import("./env")).env;
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("storage settings", () => {
  it("uses Supabase Storage when no S3 setting is filled in", async () => {
    expect((await loadEnv({})).s3).toBeNull();
  });

  it("uses S3 when all its settings are filled in", async () => {
    expect((await loadEnv(S3)).s3).toEqual({
      region: "ap-southeast-2",
      bucket: "ttn-photos-prod",
      credentials: { accessKeyId: "AKIAABCDEFGHIJKLMNOP", secretAccessKey: "secret" },
    });
  });

  it("names what is missing from a half-filled S3 setup", async () => {
    await expect(loadEnv({ S3_REGION: "ap-southeast-2", S3_BUCKET: "ttn-photos-prod" })).rejects.toThrow(
      /S3_ACCESS_KEY_ID[\s\S]*S3_SECRET_ACCESS_KEY[\s\S]*PHOTOS_PUBLIC_URL/,
    );
  });

  it("needs the CloudFront address with S3, or photos would point at Supabase", async () => {
    await expect(loadEnv({ ...S3, PHOTOS_PUBLIC_URL: "" })).rejects.toThrow(/PHOTOS_PUBLIC_URL: needed with S3/);
  });

  it("refuses a bucket name with dots and a region that isn't one", async () => {
    await expect(loadEnv({ ...S3, S3_BUCKET: "images.traveltonepal.com" })).rejects.toThrow(/S3_BUCKET/);
    await expect(loadEnv({ ...S3, S3_REGION: "Sydney" })).rejects.toThrow(/S3_REGION/);
  });

  it("refuses a secret key pasted as the access key ID", async () => {
    await expect(loadEnv({ ...S3, S3_ACCESS_KEY_ID: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" })).rejects.toThrow(/S3_ACCESS_KEY_ID/);
  });
});

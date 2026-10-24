import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const SETTINGS = { SUPABASE_URL: "https://abc.supabase.co", SUPABASE_PUBLISHABLE_KEY: "sb_publishable_0123456789abcdef", PHOTOS_PUBLIC_URL: "", REVALIDATE_SECRET: "" };

/** env.ts read with these settings (it reads process.env once, when first imported). */
const loadEnv = async (overrides: Partial<typeof SETTINGS> = {}) => {
  for (const [name, value] of Object.entries({ ...SETTINGS, ...overrides })) vi.stubEnv(name, value);
  vi.resetModules();
  return import("./env");
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("website settings", () => {
  it("serves photos from Supabase Storage by default", async () => {
    const { env, photosPublicBaseUrl } = await loadEnv();
    expect(photosPublicBaseUrl).toBe("https://abc.supabase.co/storage/v1/object/public/photos");
    expect(env.REVALIDATE_SECRET).toBeUndefined();
  });

  it("drops trailing slashes so photo addresses never get “//”", async () => {
    expect((await loadEnv({ PHOTOS_PUBLIC_URL: "https://images.example.com/" })).photosPublicBaseUrl).toBe("https://images.example.com");
    expect((await loadEnv({ SUPABASE_URL: "https://abc.supabase.co/" })).photosPublicBaseUrl).toBe("https://abc.supabase.co/storage/v1/object/public/photos");
  });

  it("accepts a long enough refresh secret", async () => {
    const secret = "x".repeat(32);
    expect((await loadEnv({ REVALIDATE_SECRET: secret })).env.REVALIDATE_SECRET).toBe(secret);
  });

  it("fails clearly for a missing or wrong setting", async () => {
    await expect(loadEnv({ SUPABASE_URL: "" })).rejects.toThrow(/SUPABASE_URL/);
    await expect(loadEnv({ SUPABASE_PUBLISHABLE_KEY: "short" })).rejects.toThrow(/SUPABASE_PUBLISHABLE_KEY/);
    await expect(loadEnv({ PHOTOS_PUBLIC_URL: "not a url" })).rejects.toThrow(/PHOTOS_PUBLIC_URL/);
    await expect(loadEnv({ REVALIDATE_SECRET: "too-short" })).rejects.toThrow(/REVALIDATE_SECRET/);
  });
});

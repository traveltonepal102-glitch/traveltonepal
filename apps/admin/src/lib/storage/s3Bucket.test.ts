import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { s3Bucket } from "./s3Bucket";
import { s3BucketOrigin } from "./s3BucketOrigin";
import { createS3PhotoStorage } from "./s3PhotoStorage";

const SETTINGS = {
  region: "ap-southeast-2",
  bucket: "ttn-photos-prod",
  credentials: { accessKeyId: "AKIAABCDEFGHIJKLMNOP", secretAccessKey: "secret" },
};

const FILE = { contentType: "image/jpeg", byteSize: 1234 };

/** Signing happens offline: no request reaches AWS. */
const uploadLink = async () => new URL(await s3Bucket(SETTINGS).createUploadUrl("private/uploads/abc", FILE));

describe("S3 upload links", () => {
  it("point at the bucket address the Content-Security-Policy allows", async () => {
    expect((await uploadLink()).origin).toBe(s3BucketOrigin(SETTINGS.region, SETTINGS.bucket));
  });

  it("accept only the checked type and size", async () => {
    expect((await uploadLink()).searchParams.get("X-Amz-SignedHeaders")).toBe("content-length;content-type;host");
  });

  it("carry no checksum, which a browser upload could never match", async () => {
    const names = [...(await uploadLink()).searchParams.keys()].map((name) => name.toLowerCase());
    expect(names.filter((name) => name.includes("checksum"))).toEqual([]);
  });

  it("put photo uploads in the private folder CloudFront may not read", async () => {
    const link = new URL(await createS3PhotoStorage(SETTINGS).createUploadUrl("uploads/abc", FILE));
    expect(link.pathname).toBe("/private/uploads/abc");
  });
});

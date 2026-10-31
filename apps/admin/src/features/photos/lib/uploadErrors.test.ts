import { describe, expect, it } from "vitest";

import { checkPhotoFile, storageUploadErrorMessage } from "./uploadErrors";

describe("checkPhotoFile", () => {
  it("lets JPEG, PNG and WebP photos up to 20 MB through", () => {
    expect(checkPhotoFile({ name: "lake.jpg", type: "image/jpeg", size: 5_000_000 })).toBeUndefined();
    expect(checkPhotoFile({ name: "lake.webp", type: "image/webp", size: 20 * 1024 * 1024 })).toBeUndefined();
  });

  it("says what to do with an iPhone photo and other known types", () => {
    expect(checkPhotoFile({ name: "IMG_1.HEIC", type: "image/heic", size: 1 })).toMatch(/iPhone.*JPEG/);
    expect(checkPhotoFile({ name: "map.svg", type: "image/svg+xml", size: 1 })).toMatch(/SVG/);
    expect(checkPhotoFile({ name: "notes", type: "", size: 1 })).toMatch(/JPEG, PNG or WebP/);
  });

  it("names the photo's size when it is too large, and catches empty files", () => {
    expect(checkPhotoFile({ name: "big.jpg", type: "image/jpeg", size: 25 * 1024 * 1024 })).toBe(
      "This photo is 25.0 MB; photos can be up to 20.0 MB. Save a smaller copy and add it again.",
    );
    expect(checkPhotoFile({ name: "empty.jpg", type: "image/jpeg", size: 0 })).toMatch(/empty/);
  });
});

describe("storageUploadErrorMessage", () => {
  it("explains no answer at all (connection or CORS)", () => {
    expect(storageUploadErrorMessage(0, "")).toMatch(/internet connection.*CORS/);
  });

  it("reads S3's error code", () => {
    const xml = (code: string) => `<?xml version="1.0"?><Error><Code>${code}</Code><Message>…</Message></Error>`;
    expect(storageUploadErrorMessage(403, xml("RequestTimeTooSkewed"))).toMatch(/clock/);
    expect(storageUploadErrorMessage(403, xml("AccessDenied"))).toMatch(/expired/);
    expect(storageUploadErrorMessage(400, xml("EntityTooLarge"))).toMatch(/too large/);
    expect(storageUploadErrorMessage(503, xml("SlowDown"))).toMatch(/try again in a minute/i);
  });

  it("reads Supabase Storage's answer and names anything unexpected", () => {
    expect(storageUploadErrorMessage(400, JSON.stringify({ statusCode: "403", error: "Unauthorized", message: "…" }))).toBe(
      "The storage refused the photo (400 Unauthorized). Add it again; if it keeps happening, tell your developer.",
    );
    expect(storageUploadErrorMessage(409, "not json")).toMatch(/\(409\)/);
  });
});

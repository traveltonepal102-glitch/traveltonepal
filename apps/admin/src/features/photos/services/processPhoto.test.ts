import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { processPhoto, PhotoRejectedError } = await import("./processPhoto");

/** A plain test image; `exif` adds camera and GPS tags like a phone photo has. */
const makePhoto = (width: number, height: number, options: { exif?: boolean; orientation?: number } = {}) => {
  let image = sharp({ create: { width, height, channels: 3, background: { r: 30, g: 90, b: 160 } } }).jpeg();
  if (options.exif) {
    image = image.withExif({
      IFD0: { Make: "TestPhone", Model: "X", Artist: "Owner Name" },
      IFD3: { GPSLatitudeRef: "N", GPSLatitude: "28/1 12/1 36/1", GPSLongitudeRef: "E", GPSLongitude: "85/1 33/1 36/1" },
    });
  }
  if (options.orientation) image = image.withMetadata({ orientation: options.orientation });
  return image.toBuffer();
};

describe("processPhoto", () => {
  it("removes GPS and camera data from everything it makes", async () => {
    const upload = await makePhoto(1000, 750, { exif: true });
    expect((await sharp(upload).metadata()).exif).toBeDefined();

    const result = await processPhoto(upload);
    for (const file of [result.master, result.share, ...result.variants.map((variant) => variant.body)]) {
      const metadata = await sharp(file).metadata();
      expect(metadata.exif).toBeUndefined();
      expect(metadata.xmp).toBeUndefined();
    }
  });

  it("makes WebP sizes up to the photo's own width, never larger", async () => {
    const result = await processPhoto(await makePhoto(1000, 750));
    expect(result.variants.map((variant) => variant.width)).toEqual([400, 800, 1000]);
    const largest = await sharp(result.variants[2].body).metadata();
    expect(largest).toMatchObject({ format: "webp", width: 1000, height: 750 });
    expect(result.placeholder).toMatch(/^data:image\/webp;base64,/);
  });

  it("caps the master at 3000 px and turns sideways phone photos upright", async () => {
    const big = await processPhoto(await makePhoto(4000, 3000));
    expect([big.width, big.height]).toEqual([3000, 2250]);
    expect(big.variants.map((variant) => variant.width)).toEqual([400, 800, 1200, 1600, 2400]);

    // Orientation 6: stored landscape, meant to be shown rotated 90° (portrait).
    const rotated = await processPhoto(await makePhoto(1200, 800, { orientation: 6 }));
    expect([rotated.width, rotated.height]).toEqual([800, 1200]);
  });

  it("makes a 1200×630 JPEG share picture, from wide, tall and small photos alike", async () => {
    for (const [width, height] of [
      [4000, 3000],
      [800, 1200],
      [700, 500],
    ]) {
      const { share } = await processPhoto(await makePhoto(width, height));
      expect(await sharp(share).metadata()).toMatchObject({ format: "jpeg", width: 1200, height: 630 });
    }
  });

  it("rejects files that aren't photos, other formats and tiny photos", async () => {
    await expect(processPhoto(Buffer.from("not an image"))).rejects.toBeInstanceOf(PhotoRejectedError);
    const gif = await sharp({ create: { width: 800, height: 600, channels: 3, background: "#fff" } }).gif().toBuffer();
    await expect(processPhoto(gif)).rejects.toThrow(/isn't supported/);
    await expect(processPhoto(await makePhoto(300, 200))).rejects.toThrow(/too small/);
  });
});

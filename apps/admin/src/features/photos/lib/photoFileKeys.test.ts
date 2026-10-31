import { describe, expect, it } from "vitest";

import { publicPhotoKeys, variantKey } from "./photoFileKeys";

describe("photo file keys", () => {
  it("names a size's file after the photo, inside the photo's own folder", () => {
    expect(variantKey("abc", "tilicho-lake", 1200)).toBe("abc/tilicho-lake-1200.webp");
    expect(variantKey("abc", null, 1200)).toBe("abc/1200.webp");
  });

  it("deletes a named photo's files and the unnamed ones it may still have", () => {
    expect(publicPhotoKeys("abc", "tilicho-lake", [400, 800])).toEqual([
      "abc/tilicho-lake-400.webp",
      "abc/tilicho-lake-800.webp",
      "abc/400.webp",
      "abc/800.webp",
      "abc/share.jpg",
    ]);
    expect(publicPhotoKeys("abc", null, [400])).toEqual(["abc/400.webp", "abc/share.jpg"]);
  });
});

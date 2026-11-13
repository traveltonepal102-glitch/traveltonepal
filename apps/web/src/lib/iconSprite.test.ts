import { describe, expect, it } from "vitest";

import { iconSetVersion, iconSpriteSvg, iconSpriteUrl } from "@ttn/ui/lib/iconSprite";

const PATHS = { check: "M5 12l4 4L19 7", close: "M6 6l12 12M18 6L6 18" };

describe("icon sprite", () => {
  it("builds one symbol per icon with the set's viewBox", () => {
    const svg = iconSpriteSvg(PATHS, "0 0 24 24");
    expect(svg).toContain('<symbol id="check" viewBox="0 0 24 24"><path d="M5 12l4 4L19 7"/></symbol>');
    expect(svg).toContain('<symbol id="close" viewBox="0 0 24 24">');
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg">')).toBe(true);
  });

  it("gives the sprite an address that changes with the set, so a changed icon is fetched again", () => {
    expect(iconSpriteUrl(PATHS)).toBe(`/icons.svg?v=${iconSetVersion(PATHS)}`);
    expect(iconSetVersion(PATHS)).toMatch(/^[0-9a-z]+$/);
    expect(iconSetVersion({ ...PATHS, check: "M0 0" })).not.toBe(iconSetVersion(PATHS));
  });
});

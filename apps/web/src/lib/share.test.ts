import { describe, expect, it } from "vitest";

import { emailShareUrl, whatsAppShareUrl } from "./share";

describe("share links", () => {
  it("opens WhatsApp's picker with the text encoded", () => {
    expect(whatsAppShareUrl("Best time & tips https://x.test/a?b=1")).toBe(
      "https://wa.me/?text=Best%20time%20%26%20tips%20https%3A%2F%2Fx.test%2Fa%3Fb%3D1",
    );
  });

  it("drafts an email with no recipient and spaces as %20", () => {
    expect(emailShareUrl({ subject: "A guide", body: "Read this: https://x.test" })).toBe(
      "mailto:?subject=A%20guide&body=Read%20this%3A%20https%3A%2F%2Fx.test",
    );
  });
});

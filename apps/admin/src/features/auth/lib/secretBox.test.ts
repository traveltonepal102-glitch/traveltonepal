import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";

import { decryptSecret, encryptSecret } from "./secretBox";

const key = randomBytes(32).toString("hex");

describe("secretBox", () => {
  it("round-trips a secret", () => {
    const stored = encryptSecret("JBSWY3DPEHPK3PXP", key);
    expect(stored).not.toContain("JBSWY3DPEHPK3PXP");
    expect(decryptSecret(stored, key)).toBe("JBSWY3DPEHPK3PXP");
  });

  it("uses a new IV every time", () => {
    expect(encryptSecret("same", key)).not.toBe(encryptSecret("same", key));
  });

  it("rejects a changed value", () => {
    const [version, iv, tag, cipherText] = encryptSecret("secret", key).split(".");
    const flipped = Buffer.from(cipherText, "base64url");
    flipped[0] ^= 1;
    expect(() => decryptSecret([version, iv, tag, flipped.toString("base64url")].join("."), key)).toThrow();
  });

  it("rejects the wrong key", () => {
    const stored = encryptSecret("secret", key);
    expect(() => decryptSecret(stored, randomBytes(32).toString("hex"))).toThrow();
  });

  it("rejects an unknown format", () => {
    expect(() => decryptSecret("plain-text", key)).toThrow("Unknown encrypted secret format");
  });

  it("rejects a key of the wrong length", () => {
    expect(() => encryptSecret("secret", "abcd")).toThrow("32 bytes");
  });
});

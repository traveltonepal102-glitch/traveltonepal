import { generate, generateSecret } from "otplib";
import { describe, expect, it } from "vitest";

import { createTotpSetup, isTotpCode, isTotpSecret, verifyTotpCode } from "./totp";

const PERIOD_SECONDS = 30;
const nowStep = () => Math.floor(Date.now() / 1000 / PERIOD_SECONDS);
const codeAt = (secret: string, secondsFromNow: number) =>
  generate({ secret, epoch: Math.floor(Date.now() / 1000) + secondsFromNow });

describe("verifyTotpCode", () => {
  const secret = generateSecret();

  it("accepts the current code and returns its time step", async () => {
    const step = await verifyTotpCode({ secret, code: await codeAt(secret, 0) });
    expect(step).toBe(nowStep());
  });

  it("rejects a wrong code", async () => {
    const code = await codeAt(secret, 0);
    const wrong = code === "000000" ? "111111" : "000000";
    expect(await verifyTotpCode({ secret, code: wrong })).toBeNull();
  });

  it("rejects a code that was already used (replay)", async () => {
    const code = await codeAt(secret, 0);
    const step = await verifyTotpCode({ secret, code });
    expect(await verifyTotpCode({ secret, code, lastTimeStep: step })).toBeNull();
  });

  it("rejects a code far outside the clock-drift window", async () => {
    expect(await verifyTotpCode({ secret, code: await codeAt(secret, -5 * PERIOD_SECONDS) })).toBeNull();
  });

  it.each(["", "12345", "1234567", "12a456", " 123456"])("rejects malformed code %j", async (code) => {
    expect(await verifyTotpCode({ secret, code })).toBeNull();
  });
});

describe("input guards", () => {
  it("isTotpCode accepts exactly 6 digits", () => {
    expect(isTotpCode("123456")).toBe(true);
    expect(isTotpCode(123456)).toBe(false);
    expect(isTotpCode("12345")).toBe(false);
  });

  it("isTotpSecret accepts base32 secrets only", () => {
    expect(isTotpSecret(generateSecret())).toBe(true);
    expect(isTotpSecret("not-a-secret")).toBe(false);
    expect(isTotpSecret(undefined)).toBe(false);
  });

  it("isTotpSecret rejects secrets otplib would refuse (too short)", () => {
    expect(isTotpSecret("JBSWY3DPEHPK3PXPJBSWY3DP")).toBe(false);
  });
});

describe("createTotpSetup", () => {
  it("returns a valid secret and a PNG QR code", async () => {
    const setup = await createTotpSetup("owner@example.com");
    expect(isTotpSecret(setup.secret)).toBe(true);
    expect(setup.qrDataUrl.startsWith("data:image/png;base64,")).toBe(true);
  });
});

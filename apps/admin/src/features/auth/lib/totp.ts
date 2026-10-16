import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

import { TOTP_ISSUER } from "../constants";

const CODE_PATTERN = /^\d{6}$/;
// generateSecret() makes 20 random bytes = 32 base32 characters; accept only that shape from clients
// (otplib throws on secrets under 16 bytes, so a loose check would turn bad input into a 500).
const BASE32_SECRET_PATTERN = /^[A-Z2-7]{32}$/;
// Accept the previous and next 30-second code too, for clock drift on the phone.
const EPOCH_TOLERANCE_SECONDS = 30;

export type TotpSetup = {
  secret: string;
  qrDataUrl: string;
};

export const isTotpCode = (value: unknown): value is string => typeof value === "string" && CODE_PATTERN.test(value);

export const isTotpSecret = (value: unknown): value is string =>
  typeof value === "string" && BASE32_SECRET_PATTERN.test(value);

export const createTotpSetup = async (accountEmail: string): Promise<TotpSetup> => {
  const secret = generateSecret();
  const uri = generateURI({ issuer: TOTP_ISSUER, label: accountEmail, secret });
  const qrDataUrl = await QRCode.toDataURL(uri, { margin: 1, width: 220 });

  return { secret, qrDataUrl };
};

type VerifyTotpArgs = {
  secret: string;
  code: string;
  /** Last accepted time step: codes from this step or earlier are rejected (no replay). */
  lastTimeStep?: number | null;
};

/** Returns the matched time step, or null when the code is wrong or already used. */
export const verifyTotpCode = async ({ secret, code, lastTimeStep }: VerifyTotpArgs): Promise<number | null> => {
  if (!isTotpCode(code)) return null;

  const result = await verify({
    secret,
    token: code,
    epochTolerance: EPOCH_TOLERANCE_SECONDS,
    afterTimeStep: lastTimeStep ?? undefined,
  });

  // verify() returns a TOTP or HOTP result; only the TOTP one carries the time step.
  return result.valid && "timeStep" in result ? result.timeStep : null;
};

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// AES-256-GCM: the auth tag makes any change to the stored value fail on decrypt.
const ALGORITHM = "aes-256-gcm";
const VERSION = "v1";
const IV_BYTES = 12;

const toKey = (hexKey: string) => {
  const key = Buffer.from(hexKey, "hex");
  if (key.length !== 32) throw new Error("Encryption key must be 32 bytes (64 hex characters)");
  return key;
};

export const encryptSecret = (plainText: string, hexKey: string): string => {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, toKey(hexKey), iv);
  const cipherText = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [VERSION, iv, tag, cipherText].map((part) => (typeof part === "string" ? part : part.toString("base64url"))).join(".");
};

export const decryptSecret = (stored: string, hexKey: string): string => {
  const [version, iv, tag, cipherText] = stored.split(".");
  if (version !== VERSION || !iv || !tag || !cipherText) throw new Error("Unknown encrypted secret format");

  const decipher = createDecipheriv(ALGORITHM, toKey(hexKey), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));

  return Buffer.concat([decipher.update(Buffer.from(cipherText, "base64url")), decipher.final()]).toString("utf8");
};

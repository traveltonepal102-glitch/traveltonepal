import { z } from "zod";

import { LOGIN_REASON } from "../constants";
import type { Credentials } from "../types";

type LoginBody = Credentials & {
  totp?: string;
  totpSetupSecret?: string;
};

export type LoginResult =
  | { status: "success" }
  | { status: "totpRequired" }
  | { status: "totpSetupRequired"; secret: string; qrDataUrl: string }
  | { status: "error"; message: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";
const NETWORK_ERROR = "Could not reach the server. Check your connection and try again.";

// Payload's error body: { errors: [{ message, data? }] }
const errorBodySchema = z.object({
  errors: z
    .array(z.object({ message: z.string(), data: z.record(z.string(), z.unknown()).nullish() }))
    .min(1),
});

const setupDataSchema = z.object({
  secret: z.string().min(16),
  qrDataUrl: z.string().startsWith("data:image/png;base64,"),
});

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null; // Not JSON (e.g. a proxy error page): handled as a generic error below.
  }
};

/** Posts to Payload's login endpoint; on success Payload sets the HTTP-only session cookie. */
export const loginRequest = async (url: string, body: LoginBody): Promise<LoginResult> => {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { status: "error", message: NETWORK_ERROR };
  }

  if (response.ok) return { status: "success" };

  const parsed = errorBodySchema.safeParse(await readJson(response));
  if (!parsed.success) return { status: "error", message: GENERIC_ERROR };

  const [{ message, data }] = parsed.data.errors;
  if (data?.reason === LOGIN_REASON.totpRequired) return { status: "totpRequired" };

  if (data?.reason === LOGIN_REASON.totpSetupRequired) {
    const setup = setupDataSchema.safeParse(data);
    return setup.success ? { status: "totpSetupRequired", ...setup.data } : { status: "error", message: GENERIC_ERROR };
  }

  return { status: "error", message };
};

import { APIError, incrementLoginAttempts, LockedAuth } from "payload";
import type { CollectionBeforeOperationHook, TypedUser } from "payload";

import { env } from "@/env";

import { LOGIN_REASON } from "../constants";
import { decryptSecret } from "../lib/secretBox";
import { isTotpSecret, verifyTotpCode } from "../lib/totp";
import { setTotpLoginContext } from "./totpLoginContext";

type AdminUserRow = TypedUser & {
  lockUntil?: string | null;
  totpSecret?: string | null;
  totpLastTimeStep?: number | null;
};

const invalidCodeError = () =>
  new APIError("That code is not right. Check your authenticator app and try again.", 401, {
    reason: LOGIN_REASON.totpInvalid,
  });

const isLocked = (user: AdminUserRow) => Boolean(user.lockUntil && new Date(user.lockUntil).getTime() > Date.now());

/**
 * Runs before Payload checks the password, outside its login transaction, so a wrong code
 * can be counted as a failed attempt (5 wrong tries of either kind lock the account).
 */
export const checkTotpCode: CollectionBeforeOperationHook = async ({ args, collection, operation, req }) => {
  if (operation !== "login") return args;

  const email = typeof req.data?.email === "string" ? req.data.email.trim().toLowerCase() : "";
  const code: unknown = req.data?.totp;
  const hasCode = code !== undefined && code !== "";

  const user = email
    ? await req.payload.db.findOne<AdminUserRow>({ collection: collection.slug, req, where: { email: { equals: email } } })
    : null;

  if (!user) {
    // Same answer as for a known email, so the code step does not reveal which emails exist.
    if (hasCode) throw invalidCodeError();
    return args; // Payload answers "email or password is incorrect".
  }

  // Check the lock first: wrong codes during a lock must not extend it.
  if (isLocked(user)) throw new LockedAuth(req.t);

  if (!hasCode) {
    setTotpLoginContext(req, { status: user.totpSecret ? "required" : "setup" });
    return args;
  }

  // An enrolled secret always wins: a setup secret from the client can't replace it.
  const setupSecret: unknown = req.data?.totpSetupSecret;
  const secret = user.totpSecret
    ? decryptSecret(user.totpSecret, env.TOTP_ENCRYPTION_KEY)
    : isTotpSecret(setupSecret)
      ? setupSecret
      : null;

  const timeStep =
    secret && typeof code === "string"
      ? await verifyTotpCode({ secret, code, lastTimeStep: user.totpLastTimeStep })
      : null;

  if (timeStep === null) {
    await incrementLoginAttempts({ collection, payload: req.payload, user });
    throw invalidCodeError();
  }

  setTotpLoginContext(req, {
    status: "verified",
    timeStep,
    newSecret: user.totpSecret ? undefined : (secret ?? undefined),
  });
  return args;
};

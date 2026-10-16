import { APIError, Forbidden } from "payload";
import type { CollectionBeforeLoginHook } from "payload";

import { env } from "@/env";

import { LOGIN_REASON } from "../constants";
import { encryptSecret } from "../lib/secretBox";
import { createTotpSetup } from "../lib/totp";
import { getTotpLoginContext } from "./totpLoginContext";

/**
 * Runs after Payload accepted the password, inside its login transaction: throwing here
 * rolls back the new session, so no login cookie is issued without a valid code.
 */
export const completeTotpLogin: CollectionBeforeLoginHook = async ({ collection, req, user }) => {
  const totpLogin = getTotpLoginContext(req);

  // Default deny: every login must have passed through checkTotpCode.
  if (!totpLogin) throw new Forbidden(req.t);

  if (totpLogin.status === "required") {
    throw new APIError("Enter the 6-digit code from your authenticator app.", 401, {
      reason: LOGIN_REASON.totpRequired,
    });
  }

  if (totpLogin.status === "setup") {
    const setup = await createTotpSetup(user.email);
    throw new APIError("Set up your authenticator app to finish signing in.", 401, {
      reason: LOGIN_REASON.totpSetupRequired,
      ...setup,
    });
  }

  await req.payload.db.updateOne({
    collection: collection.slug,
    id: user.id,
    data: {
      totpLastTimeStep: totpLogin.timeStep,
      ...(totpLogin.newSecret && { totpSecret: encryptSecret(totpLogin.newSecret, env.TOTP_ENCRYPTION_KEY) }),
    },
    req,
    returning: false,
  });

  return user;
};

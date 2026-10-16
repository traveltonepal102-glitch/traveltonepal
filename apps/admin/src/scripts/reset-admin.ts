/**
 * Creates the single admin user, or resets it (TRD: no forgot-password screen, the developer resets it).
 *
 *   pnpm --filter admin admin:reset owner@example.com            create, or new password + unlock
 *   pnpm --filter admin admin:reset owner@example.com reset-2fa  also clear the authenticator
 *
 * Prints a new random password once. Every reset also signs out all sessions.
 * (`payload run` passes only positional arguments to scripts, so there are no --flags.)
 */
import { randomBytes } from "node:crypto";
import { getPayload } from "payload";

import { ADMIN_SCRIPT_CONTEXT_KEY } from "../features/auth/constants";
import config from "../payload.config";

const USAGE = "Usage: pnpm --filter admin admin:reset owner@example.com [reset-2fa]";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const [emailArg = "", option] = process.argv.slice(2);
const email = emailArg.trim().toLowerCase();
const shouldReset2fa = option === "reset-2fa";

if (!EMAIL_PATTERN.test(email) || (option !== undefined && !shouldReset2fa)) {
  console.error(USAGE);
  process.exit(1);
}

const password = randomBytes(18).toString("base64url");
const context = { [ADMIN_SCRIPT_CONTEXT_KEY]: true };
const payload = await getPayload({ config });

const {
  docs: [existing],
} = await payload.find({ collection: "users", limit: 1, overrideAccess: true, context });

if (existing) {
  // A password change also makes Payload drop every session (signs out everywhere).
  await payload.update({ collection: "users", id: existing.id, data: { email, password }, overrideAccess: true, context });
  await payload.db.updateOne({
    collection: "users",
    id: existing.id,
    data: {
      loginAttempts: 0,
      lockUntil: null,
      ...(shouldReset2fa && { totpSecret: null, totpLastTimeStep: null }),
    },
    returning: false,
  });
} else {
  await payload.create({ collection: "users", data: { email, password }, overrideAccess: true, context });
}

console.log(`\n${existing ? "Reset" : "Created"} admin user ${email}`);
console.log(`Password (shown once): ${password}`);
if (!existing || shouldReset2fa) console.log("The authenticator is set up at the next login.");
process.exit(0);

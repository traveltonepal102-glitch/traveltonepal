import type { Access, CollectionConfig } from "payload";

import { LOCK_TIME_MS, MAX_LOGIN_ATTEMPTS } from "@/features/auth/constants";
import { blockAccountOperations } from "@/features/auth/collectionHooks/blockAccountOperations";
import { checkTotpCode } from "@/features/auth/collectionHooks/checkTotpCode";
import { completeTotpLogin } from "@/features/auth/collectionHooks/completeTotpLogin";

const deny: Access = () => false;
const ownAccountOnly: Access = ({ req }) => (req.user ? { id: { equals: req.user.id } } : false);

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: {
    maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
    lockTime: LOCK_TIME_MS,
    cookies: {
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    },
  },
  // The admin user is created and reset only by the developer script (src/scripts/reset-admin.ts).
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: deny,
    read: ownAccountOnly,
    update: deny,
    delete: deny,
    unlock: deny,
  },
  hooks: {
    beforeOperation: [blockAccountOperations, checkTotpCode],
    beforeLogin: [completeTotpLogin],
  },
  fields: [
    // Encrypted with TOTP_ENCRYPTION_KEY; never returned by the API.
    { name: "totpSecret", type: "text", hidden: true },
    // Last accepted code's time step, so a code can't be used twice.
    { name: "totpLastTimeStep", type: "number", hidden: true },
  ],
};

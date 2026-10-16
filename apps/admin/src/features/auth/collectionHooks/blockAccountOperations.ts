import { Forbidden } from "payload";
import type { CollectionBeforeOperationHook } from "payload";

import { ADMIN_SCRIPT_CONTEXT_KEY } from "../constants";

/**
 * One admin user, managed by the developer (TRD): no sign-up, no forgot or reset password.
 * Also closes Payload's "create first user" form, which would let anyone create the
 * admin while the database is empty (e.g. right after a fresh deploy).
 */
export const blockAccountOperations: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation === "forgotPassword" || operation === "resetPassword") throw new Forbidden(req.t);
  if (operation === "create" && req.context[ADMIN_SCRIPT_CONTEXT_KEY] !== true) throw new Forbidden(req.t);

  return args;
};

/** Name shown in the authenticator app next to the account email. */
export const TOTP_ISSUER = "Travel To Nepal Admin";

/** Matches the TRD: locked 15 minutes after 5 wrong tries (password or code). */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_TIME_MS = 15 * 60 * 1000;

/** Reasons sent in `errors[0].data.reason` by the login endpoint, read by the login form. */
export const LOGIN_REASON = {
  totpRequired: "totp_required",
  totpSetupRequired: "totp_setup_required",
  totpInvalid: "totp_invalid",
} as const;

/** Set on `req.context` by the reset-admin script; the only way to create the admin user. */
export const ADMIN_SCRIPT_CONTEXT_KEY = "isAdminScript";

import { HOME_PATH, LOGIN_PATH } from "../constants";

/**
 * Where to go after signing in: only a path on this site ("/treks?page=2"), never another site
 * ("//evil.com", "https://…", "/\evil.com") and never back to the sign-in page. Anything else goes home.
 */
export const getSafeRedirectPath = (value: unknown): string => {
  if (typeof value !== "string" || !value.startsWith("/")) return HOME_PATH;
  if (value.startsWith("//") || value.includes("\\")) return HOME_PATH;
  if (value === LOGIN_PATH || value.startsWith(`${LOGIN_PATH}?`) || value.startsWith(`${LOGIN_PATH}/`)) return HOME_PATH;
  return value;
};

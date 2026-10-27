import { appEnvironment } from "./appEnvironment";

/**
 * Error monitoring (Sentry) settings shared by the website and the admin: errors only, no performance tracing,
 * no session replay and no personal data (no IP address, cookies or request bodies). On only where
 * NEXT_PUBLIC_APP_ENV is "production" and NEXT_PUBLIC_SENTRY_DSN is set; the DSN is not a secret (every visitor's
 * browser gets it).
 */
export const errorMonitoringOptions = () => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const environment = appEnvironment();
  return {
    dsn,
    enabled: Boolean(dsn) && environment === "production",
    environment,
    sendDefaultPii: false,
  };
};

/** Where browsers send error reports (for the admin's Content-Security-Policy), or null without a DSN. */
export const errorMonitoringOrigin = (dsn: string | undefined) => {
  if (!dsn) return null;
  try {
    return new URL(dsn).origin;
  } catch {
    return null;
  }
};

/**
 * An error page got a server error: the server already reported it (onRequestError), and the browser only
 * sees its digest, not the message. Reporting it again from the browser would count it twice.
 */
export const isReportedByServer = (error: unknown) =>
  typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string";

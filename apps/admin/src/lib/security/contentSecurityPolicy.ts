/**
 * Content-Security-Policy for the admin: scripts only from this site and only with this request's nonce,
 * so an injected <script> can't run. Next.js reads the nonce from the request's CSP header and adds it
 * to its own scripts (pages are rendered per request, which nonces need).
 *
 * Styles allow 'unsafe-inline': next/image sets inline style attributes, which a nonce can't cover.
 * Development needs 'unsafe-eval' (React's debugging) and plain http (localhost).
 */
export const buildContentSecurityPolicy = (nonce: string, isDevelopment: boolean) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

/** A fresh, unguessable nonce for one request. */
export const createNonce = () => btoa(crypto.randomUUID());

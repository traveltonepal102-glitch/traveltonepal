import * as Sentry from "@sentry/nextjs";
import { errorMonitoringOptions } from "@ttn/config/errorMonitoring";

/** Starts error monitoring on the server (Node.js and edge), once per server instance. */
export const register = () => {
  Sentry.init(errorMonitoringOptions());
};

/** Errors from pages, route handlers, Server Actions and the proxy, with the route they happened in. */
export const onRequestError = Sentry.captureRequestError;

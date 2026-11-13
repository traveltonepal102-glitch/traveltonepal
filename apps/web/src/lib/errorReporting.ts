import { errorMonitoringOptions } from "@ttn/config/errorMonitoring";

type ErrorSdk = typeof import("@sentry/nextjs");

/** How long after the page has loaded the error monitoring starts, when the browser can't say it is idle. */
const START_DELAY_MS = 3000;

let sdk: Promise<ErrorSdk> | undefined;

/**
 * Sentry in the browser, downloaded only when it is first needed and started once. Its code (about 100 KB) is not part
 * of what every page loads up front: on a phone it competed with the page's first photo.
 */
const loadSdk = () =>
  (sdk ??= import("@sentry/nextjs").then((Sentry) => {
    Sentry.init(errorMonitoringOptions());
    return Sentry;
  }));

/** Reports an error the page caught itself (an error page). Nothing happens where error monitoring is off. */
export const reportError = (error: unknown) => {
  if (!errorMonitoringOptions().enabled) return;
  void loadSdk().then((Sentry) => Sentry.captureException(error));
};

/**
 * Starts error monitoring once the page has loaded and the browser is idle. Errors thrown before that are kept and
 * reported as soon as it has started, so loading it late loses none.
 */
export const startErrorMonitoring = () => {
  if (!errorMonitoringOptions().enabled) return;

  const early: unknown[] = [];
  const keepError = (event: ErrorEvent) => early.push(event.error ?? event.message);
  const keepRejection = (event: PromiseRejectionEvent) => early.push(event.reason);
  window.addEventListener("error", keepError);
  window.addEventListener("unhandledrejection", keepRejection);

  const start = () =>
    void loadSdk().then((Sentry) => {
      window.removeEventListener("error", keepError);
      window.removeEventListener("unhandledrejection", keepRejection);
      for (const error of early) Sentry.captureException(error);
    });
  const startWhenIdle = () => ("requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: START_DELAY_MS }) : setTimeout(start, START_DELAY_MS));

  if (document.readyState === "complete") startWhenIdle();
  else window.addEventListener("load", startWhenIdle, { once: true });
};

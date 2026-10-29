"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

import { useConsent } from "@/features/consent/useConsent";

import { ANALYTICS_IDS } from "./analyticsSettings";

type Gtag = (...args: unknown[]) => void;
type ClarityQueue = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    clarity?: ClarityQueue;
  }
}

/** Sets up the queues the two scripts read, so calls made before they load are kept. */
const prepareQueues = () => {
  window.dataLayer ??= [];
  // gtag must push the `arguments` object itself (Google's snippet), not an array.
  window.gtag ??= function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  if (!window.clarity) {
    const queue: unknown[][] = [];
    window.clarity = Object.assign((...args: unknown[]) => {
      queue.push(args);
    }, { q: queue });
  }
};

/**
 * Google Analytics and Microsoft Clarity (Privacy policy › "Cookies, analytics and external media"): loaded only
 * after the visitor allows "Analytics" in the cookie settings, only on the live site, and only for the ids that are
 * set. Withdrawing consent tells both to stop collecting at once (a loaded script can't be taken back until reload).
 */
export const AnalyticsScripts = () => {
  const consent = useConsent();
  const isAllowed = consent?.analytics === true;
  const hasStarted = useRef(false);
  const { googleAnalytics, clarity } = ANALYTICS_IDS;

  useEffect(() => {
    if (!googleAnalytics && !clarity) return;
    if (isAllowed) {
      prepareQueues();
      if (hasStarted.current) {
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
      } else {
        // Measurement only: never advertising (Google's consent mode).
        window.gtag?.("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
        if (googleAnalytics) {
          window.gtag?.("js", new Date());
          window.gtag?.("config", googleAnalytics);
        }
      }
      window.clarity?.("consent");
      hasStarted.current = true;
      return;
    }
    if (!hasStarted.current) return;
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    window.clarity?.("consent", false);
  }, [isAllowed, googleAnalytics, clarity]);

  if (!isAllowed) return null;
  return (
    <>
      {googleAnalytics && <Script id="google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`} strategy="afterInteractive" />}
      {clarity && <Script id="microsoft-clarity" src={`https://www.clarity.ms/tag/${clarity}`} strategy="afterInteractive" />}
    </>
  );
};

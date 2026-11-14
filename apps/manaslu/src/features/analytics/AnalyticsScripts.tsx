"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

import { useConsent } from "@/features/consent/useConsent";

import { TAG_MANAGER } from "./analyticsSettings";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** Sets up the queue the script reads, so calls made before it loads are kept. */
const prepareQueue = () => {
  window.dataLayer ??= [];
  // gtag must push the `arguments` object itself (Google's snippet), not an array.
  window.gtag ??= function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
};

/**
 * Google Tag Manager, which loads Google Analytics (Privacy policy › "Cookies, analytics and external media"): only
 * after the visitor allows "Analytics" in the cookie banner or settings, only on the live site, and only when the
 * container's id is set. Google's consent mode is set before the script loads, so tags added in Tag Manager inherit it
 * (advertising always denied). Withdrawing consent tells them to stop collecting at once (a loaded script can't be
 * taken back until reload).
 */
export const AnalyticsScripts = () => {
  const consent = useConsent();
  const isAllowed = consent?.analytics === true;
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!TAG_MANAGER) return;
    if (isAllowed) {
      prepareQueue();
      if (hasStarted.current) {
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
      } else {
        // Measurement only: never advertising (Google's consent mode).
        window.gtag?.("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
        // Google's tag snippet: marks the page start once.
        window.gtag?.("js", new Date());
      }
      hasStarted.current = true;
      return;
    }
    if (hasStarted.current) window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }, [isAllowed]);

  if (!isAllowed || !TAG_MANAGER) return null;
  return <Script id="google-tag-manager" src={`https://www.googletagmanager.com/gtm.js?id=${TAG_MANAGER}`} strategy="afterInteractive" />;
};

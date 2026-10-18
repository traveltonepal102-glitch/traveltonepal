"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";
import type { ReactNode } from "react";

type MapConsentGateProps = {
  /** Shown until the visitor loads the map (a drawn map). */
  preview: ReactNode;
  /** Names the preview's scroll area for screen readers, e.g. "Route map". */
  previewLabel: string;
  /** The Google map; rendered only after the visitor asks for it. */
  children: ReactNode;
  /** Extra classes for the frame, e.g. to let it grow inside a flex layout. */
  className?: string;
};

/**
 * Click-to-load wrapper for Google maps. Nothing is requested from Google until the visitor asks
 * (GDPR: Google sees their IP address and may set cookies), and the page stays fast without it.
 */
export const MapConsentGate = ({ preview, previewLabel, children, className = "" }: MapConsentGateProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#dde3d6] bg-[#e9efe3] ${className}`}>
      {isLoaded ? (
        children
      ) : (
        <>
          {/* Phones scroll a wide preview sideways so its labels stay readable. */}
          <div
            role="region"
            aria-label={previewLabel}
            tabIndex={0}
            className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
          >
            {preview}
          </div>
          {/* Phones: below the preview, so it does not hide it; wider screens: over its corner. */}
          <div className="flex flex-col gap-2.5 border-t border-[#dde3d6] bg-white p-3.5 sm:absolute sm:right-3 sm:bottom-3 sm:max-w-sm sm:rounded-lg sm:border-0 sm:bg-white/95 sm:shadow-popover">
            <p className="flex items-start gap-2 text-xs text-text">
              <Icon name="map" size={18} className="mt-px flex-none text-brand" />
              <span>
                <strong className="font-display text-body-sm text-ink">Interactive Google map</strong>
                <br />
                Loading it connects to Google, which can see your IP address and may set cookies.
              </span>
            </p>
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-4 text-caption font-bold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Icon name="pin_drop" size={18} />
              Load Google map
            </button>
          </div>
        </>
      )}
    </div>
  );
};

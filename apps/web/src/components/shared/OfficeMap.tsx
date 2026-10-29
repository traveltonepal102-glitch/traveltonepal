"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { useConsent } from "@/features/consent/useConsent";

type OfficeMapProps = {
  /** Opens the office in Google Maps (new tab). */
  mapsUrl: string;
  /** Google's "Embed a map" address from Site settings; "" keeps the drawn map. */
  embedUrl: string;
  label?: string;
  className?: string;
};

const FRAME = "relative overflow-hidden rounded-2xl border border-[#dde3d6] bg-[#eef0ea]";
const BUTTON =
  "inline-flex min-h-10.5 cursor-pointer items-center gap-1.5 rounded-full px-4 font-bold whitespace-nowrap shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * The office map on the About and Contact pages. Google's live map (from Site settings) loads only once the visitor
 * clicks "Show the map" or allows "External media" in the cookie settings (GDPR: Google sees their IP address);
 * until then, and when none is saved, a drawn street map with a pin and "Open in Google Maps".
 */
export const OfficeMap = ({ mapsUrl, embedUrl, label = "Travel To Nepal office", className = "min-h-85" }: OfficeMapProps) => {
  const [isShown, setIsShown] = useState(false);
  const consent = useConsent();

  if (embedUrl && (isShown || consent?.externalMedia === true)) {
    return (
      <div className={`${FRAME} ${className}`}>
        <iframe
          src={embedUrl}
          title={`Google Maps: ${label}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  return (
    <div className={`${FRAME} ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <path d="M0 120 L600 90 M0 260 L600 300 M150 0 L190 400 M420 0 L380 400 M0 360 L600 330" stroke="#ffffff" strokeWidth="14" />
        <path d="M0 120 L600 90 M0 260 L600 300 M150 0 L190 400 M420 0 L380 400" stroke="#f6c26b" strokeWidth="5" />
        <rect x="230" y="150" width="120" height="80" rx="8" fill="#d5e7c9" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 32" className="absolute top-[42%] left-1/2 -mt-11 -ml-4.25 h-11.5 w-8.5">
        <path d="M12 1C6 1 1.5 5.4 1.5 11.2 1.5 19 12 31 12 31s10.5-12 10.5-19.8C22.5 5.4 18 1 12 1z" fill="#d93025" stroke="#a50e0e" />
        <circle cx="12" cy="11" r="4" fill="#ffffff" />
      </svg>
      <p className="absolute top-3 left-3 rounded-md bg-surface px-3 py-2 text-caption font-bold text-ink shadow-card">{label}</p>
      <div className="absolute inset-x-3 bottom-4.5 flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-2">
          {embedUrl && (
            <button type="button" onClick={() => setIsShown(true)} className={`${BUTTON} bg-surface text-ink hover:bg-brand-tint`}>
              <Icon name="pin_drop" size={18} />
              Show the map
            </button>
          )}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${BUTTON} bg-brand text-on-brand hover:bg-brand-hover`}>
            <Icon name="map" size={18} />
            Open in Google Maps
          </a>
        </div>
        {embedUrl && (
          <p className="rounded-md bg-surface/90 px-2.5 py-1 text-center text-xs text-muted-foreground">
            Showing the map connects to Google Maps, which can see your IP address.
          </p>
        )}
      </div>
    </div>
  );
};

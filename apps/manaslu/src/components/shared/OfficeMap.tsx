"use client";

import { useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";
import { useConsent } from "@/features/consent/useConsent";

type OfficeMapProps = {
  /** Opens the office in Google Maps; "" for none. */
  mapsUrl: string;
  /** Google's "Embed a map" address from Site settings; "" for none. */
  embedUrl: string;
  label: string;
};

const FRAME = "relative min-h-90 overflow-hidden rounded-2xl border border-solid border-line bg-forest-tint";
const BUTTON = "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border-0 px-4 text-[15px] font-semibold no-underline shadow-card";

/**
 * The office on a Google map, loaded only after a click or with "External media" allowed in Cookie settings (Google sees the
 * visitor's IP address); until then a panel with the ways to see it. Nothing shows while neither address is saved.
 */
export const OfficeMap = ({ mapsUrl, embedUrl, label }: OfficeMapProps) => {
  const [isShown, setIsShown] = useState(false);
  const consent = useConsent();
  if (!mapsUrl && !embedUrl) return null;

  if (embedUrl && (isShown || consent?.externalMedia)) {
    return (
      <div className={FRAME}>
        <iframe src={embedUrl} title={`Google Maps: ${label}`} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="absolute inset-0 size-full border-0" />
      </div>
    );
  }

  return (
    <div className={`${FRAME} flex flex-col items-center justify-center gap-3 p-6 text-center`}>
      <TrailIcon name="pin" size={36} className="text-forest" />
      <p className="font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {embedUrl && (
          <button type="button" onClick={() => setIsShown(true)} className={`${BUTTON} bg-snow text-ink hover:bg-stone`}>
            <TrailIcon name="map" />
            Show the map
          </button>
        )}
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${BUTTON} bg-forest text-snow hover:bg-forest-deep hover:text-snow`}>
            <TrailIcon name="pin" />
            Open in Google Maps
          </a>
        )}
      </div>
      {embedUrl && <p className="max-w-100 text-sm leading-5 text-muted">Showing the map connects to Google Maps, which can see your IP address.</p>}
    </div>
  );
};

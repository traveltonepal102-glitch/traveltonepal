"use client";

import type { ReactNode } from "react";

import { MapConsentGate } from "@/components/shared/MapConsentGate";

type GoogleMapEmbedProps = {
  embedUrl: string;
  /** Names the map for screen readers, e.g. "Google map of the Langtang Valley Trek". */
  title: string;
  /** Shown until the visitor loads the map (the drawn route map). */
  preview: ReactNode;
};

/** Click-to-load Google map embed (an iframe; no API key needed). */
export const GoogleMapEmbed = ({ embedUrl, title, preview }: GoogleMapEmbedProps) => (
  <MapConsentGate preview={preview ?? <div className="aspect-1000/560 min-h-60" />} previewLabel="Route map">
    <iframe
      src={embedUrl}
      title={title}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className="block h-90 w-full border-0 sm:aspect-1000/560 sm:h-auto"
    />
  </MapConsentGate>
);

"use client";

import { MapConsentGate } from "@/components/shared/MapConsentGate";

type GoogleMapEmbedProps = {
  embedUrl: string;
  /** Names the map for screen readers, e.g. "Google map of the Langtang Valley Trek". */
  title: string;
  /**
   * Crops off a My Maps map's title bar (map name, its maker's name and photo, "Made with Google My Maps"), which
   * Google has no setting to hide. The map's own Google logo and attribution stay visible.
   */
  hidesTitleBar?: boolean;
};

const FRAME_SIZE = "h-90 w-full sm:aspect-1000/560 sm:h-auto";
/** The My Maps title bar is 67px tall at every width (measured 2026-11-02): the frame starts that far above the box. */
const CROPPED_FRAME = "absolute inset-x-0 -top-[67px] h-[calc(100%+67px)] w-full border-0";

/** Click-to-load Google map embed (an iframe; no API key needed). */
export const GoogleMapEmbed = ({ embedUrl, title, hidesTitleBar = false }: GoogleMapEmbedProps) => {
  const frame = (
    <iframe
      src={embedUrl}
      title={title}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className={hidesTitleBar ? CROPPED_FRAME : `block border-0 ${FRAME_SIZE}`}
    />
  );

  return (
    <MapConsentGate preview={<div className="aspect-1000/560 min-h-60" />} previewLabel="Route map">
      {hidesTitleBar ? <div className={`relative overflow-hidden ${FRAME_SIZE}`}>{frame}</div> : frame}
    </MapConsentGate>
  );
};

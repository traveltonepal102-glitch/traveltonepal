"use client";

import { useState } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { useConsent } from "@/features/consent/useConsent";

type RouteMapFrameProps = {
  embedUrl: string;
  title: string;
  /** Crops off a My Maps map's title bar, which Google has no setting to hide; its logo and attribution stay. */
  hidesTitleBar: boolean;
};

const FRAME_SIZE = "h-90 w-full sm:aspect-1000/560 sm:h-auto";
/** The My Maps title bar is 67px tall at every width: the frame starts that far above the box. */
const CROPPED_FRAME = "absolute inset-x-0 -top-[67px] h-[calc(100%+67px)] w-full border-0";

/** The Google map, loaded only on request or with "External media" allowed in Cookie settings: until then nothing goes to Google, and the page stays fast. */
export const RouteMapFrame = ({ embedUrl, title, hidesTitleBar }: RouteMapFrameProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const consent = useConsent();

  if (!isLoaded && !consent?.externalMedia) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 rounded-[14px] border border-solid border-line bg-forest-tint p-6 text-center ${FRAME_SIZE}`}>
        <TrailIcon name="map" size={32} className="text-forest" />
        <p className="max-w-110 text-[15px] leading-5.5">Loading the map connects to Google, which can see your IP address and may set cookies.</p>
        <button type="button" onClick={() => setIsLoaded(true)} className={`${primaryButton} cursor-pointer border-0`}>
          Load Google map
        </button>
      </div>
    );
  }

  const frame = <iframe src={embedUrl} title={title} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className={hidesTitleBar ? CROPPED_FRAME : `block border-0 ${FRAME_SIZE}`} />;
  return <div className="overflow-hidden rounded-[14px] border border-solid border-line">{hidesTitleBar ? <div className={`relative overflow-hidden ${FRAME_SIZE}`}>{frame}</div> : frame}</div>;
};

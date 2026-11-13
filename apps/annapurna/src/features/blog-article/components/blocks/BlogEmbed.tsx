"use client";

import { useState } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { useConsent } from "@/features/consent/useConsent";

import type { BlogBlock } from "../../types";

type BlogEmbedProps = Omit<Extract<BlogBlock, { type: "embed" }>, "type">;

/**
 * A frame from any https address (@ttn/config/embeds): a map, a video or a widget. Nothing is requested from the service until the visitor
 * loads it here or allows "External media" in Cookie settings. The frame only runs its own scripts and opens links in a new tab.
 */
export const BlogEmbed = ({ url, service, height, title, caption }: BlogEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const consent = useConsent();

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-2xl border border-solid border-line bg-sky" style={{ height }}>
        {isLoaded || consent?.externalMedia ? (
          <iframe
            src={url}
            title={`${service.kind === "content" ? `Content from ${service.name}` : `${service.name} ${service.kind}`}: ${title}`}
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <TrailIcon name="map" size={32} className="text-navy" />
            <p className="max-w-110 text-[15px] leading-5.5">
              <strong className="block font-semibold text-ink">{title}</strong>
              Loading it connects to {service.company}, which can see your IP address and may set cookies.
            </p>
            <button type="button" onClick={() => setIsLoaded(true)} className={`${primaryButton} cursor-pointer border-0`}>
              {service.kind === "content" ? `Load content from ${service.name}` : `Load ${service.name} ${service.kind}`}
            </button>
          </div>
        )}
      </div>
      {caption && <figcaption className="text-sm leading-5 text-muted">{caption}</figcaption>}
    </figure>
  );
};

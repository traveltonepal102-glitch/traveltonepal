"use client";

import { useState } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { useConsent } from "@/features/consent/useConsent";

import type { BlogBlock } from "../../types";

type BlogEmbedProps = Omit<Extract<BlogBlock, { type: "embed" }>, "type">;
type EmbedService = BlogEmbedProps["service"];

/** The frame's name and its button, in German per kind, keeping the service's name ("Komoot-Karte laden"). */
const EMBED_WORDS: Record<EmbedService["kind"], { frame: (name: string) => string; load: (name: string) => string }> = {
  map: { frame: (name) => `${name}-Karte`, load: (name) => `${name}-Karte laden` },
  video: { frame: (name) => `${name}-Video`, load: (name) => `${name}-Video laden` },
  content: { frame: (name) => `Inhalt von ${name}`, load: (name) => `Inhalt von ${name} laden` },
};

/**
 * A frame from any https address (@ttn/config/embeds): a map, a video or a widget. Nothing is requested from the service until the visitor
 * loads it here or allows "External media" in Cookie settings. The frame only runs its own scripts and opens links in a new tab.
 */
export const BlogEmbed = ({ url, service, height, title, caption }: BlogEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const consent = useConsent();

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-2xl border border-solid border-line bg-ocean-tint" style={{ height }}>
        {isLoaded || consent?.externalMedia ? (
          <iframe
            src={url}
            title={`${EMBED_WORDS[service.kind].frame(service.name)}: ${title}`}
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <TrailIcon name="map" size={32} className="text-ocean" />
            <p className="max-w-110 text-[15px] leading-5.5">
              <strong className="block font-semibold text-ink">{title}</strong>
              Beim Laden wird eine Verbindung zu {service.company} hergestellt. Dabei wird deine IP-Adresse übermittelt, und es können Cookies gesetzt werden.
            </p>
            <button type="button" onClick={() => setIsLoaded(true)} className={`${primaryButton} cursor-pointer border-0`}>
              {EMBED_WORDS[service.kind].load(service.name)}
            </button>
          </div>
        )}
      </div>
      {caption && <figcaption className="text-sm leading-5 text-muted">{caption}</figcaption>}
    </figure>
  );
};

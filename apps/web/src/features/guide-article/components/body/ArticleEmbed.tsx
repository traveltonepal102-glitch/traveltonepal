"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { useConsent } from "@/features/consent/useConsent";

import type { ArticleBlock } from "../../types";
import { FOCUS } from "../styles";

type ArticleEmbedProps = Omit<Extract<ArticleBlock, { type: "embed" }>, "type">;

/**
 * "Embed": a map or video from an allowed service (@ttn/config/embeds). Nothing is requested from the service until
 * the visitor loads it here or allows "External media" in the cookie settings (GDPR: it sees their IP address and may
 * set cookies). The frame can't reach this page: it only runs its own scripts and opens links in a new tab.
 */
export const ArticleEmbed = ({ url, service, height, title, caption }: ArticleEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const consent = useConsent();
  const isAllowed = isLoaded || consent?.externalMedia === true;

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-xl border border-[#dde3d6] bg-[#e9efe3]" style={{ height }}>
        {isAllowed ? (
          <iframe
            src={url}
            title={`${service.name} ${service.kind}: ${title}`}
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <Icon name={service.kind === "video" ? "smart_display" : "map"} size={36} className="text-brand" />
            <p className="max-w-110 text-caption text-text">
              <strong className="block font-display text-body-sm text-ink">{title}</strong>
              Loading it connects to {service.company}, which can see your IP address and may set cookies.
            </p>
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-4 text-caption font-bold text-on-brand hover:bg-brand-hover ${FOCUS}`}
            >
              <Icon name={service.kind === "video" ? "play_circle" : "pin_drop"} size={18} />
              Load {service.name} {service.kind}
            </button>
          </div>
        )}
      </div>
      {caption && <figcaption className="text-caption text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};

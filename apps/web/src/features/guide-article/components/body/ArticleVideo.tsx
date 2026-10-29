"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { useConsent } from "@/features/consent/useConsent";

/**
 * A YouTube video in privacy-enhanced mode (youtube-nocookie.com). Nothing is requested from YouTube, not even the
 * thumbnail, until the visitor presses Play here or allows "External media" in the cookie settings (GDPR: Google
 * sees their IP address).
 */
export const ArticleVideo = ({ youtubeId, title }: { youtubeId: string; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const consent = useConsent();
  const isAllowed = isPlaying || consent?.externalMedia === true;
  const label = title || "Trail video";

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-navy">
        {isAllowed ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}${isPlaying ? "?autoplay=1" : ""}`}
            title={`YouTube video: ${label}`}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center text-white">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play video: ${label}`}
              className="inline-flex size-16 cursor-pointer items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon name="play_circle" size={44} />
            </button>
            <p className="max-w-110 text-caption text-navy-text">
              <strong className="block font-display text-body-sm text-white">{label}</strong>
              Playing it connects to YouTube (Google), which can see your IP address.
            </p>
          </div>
        )}
      </div>
      {title && <figcaption className="text-caption text-muted-foreground">{title}</figcaption>}
    </figure>
  );
};

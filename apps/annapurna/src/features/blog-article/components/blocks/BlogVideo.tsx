"use client";

import { useState } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";
import { useConsent } from "@/features/consent/useConsent";

/** A YouTube video in privacy-enhanced mode. Nothing is requested from YouTube, not even the thumbnail, until the visitor presses Play or allows "External media". */
export const BlogVideo = ({ youtubeId, title }: { youtubeId: string; title: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const consent = useConsent();
  const label = title || "Trail video";

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy-deep">
        {isPlaying || consent?.externalMedia ? (
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center">
            <p className="max-w-110 text-[15px] leading-5.5 text-on-navy-muted">
              <strong className="block font-semibold text-snow">{label}</strong>
              Playing it connects to YouTube (Google), which can see your IP address.
            </p>
            <button type="button" onClick={() => setIsPlaying(true)} aria-label={`Play video: ${label}`} className={`${primaryButton} cursor-pointer border-[1.5px] border-solid border-white/50`}>
              Play video
            </button>
          </div>
        )}
      </div>
      {title && <figcaption className="text-sm leading-5 text-muted">{title}</figcaption>}
    </figure>
  );
};

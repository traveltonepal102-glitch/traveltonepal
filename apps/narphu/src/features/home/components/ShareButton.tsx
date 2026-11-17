"use client";

import { useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

const WORDS = { idle: "Share", copied: "Link copied", failed: "Couldn't copy the link" } as const;

/** Shares the page with the phone's share sheet, else copies its address. */
export const ShareButton = ({ title, className }: { title: string; className: string }) => {
  const [status, setStatus] = useState<keyof typeof WORDS>("idle");

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      // Closing the share sheet rejects: that isn't an error.
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    const copied = await navigator.clipboard?.writeText(url).then(() => true, () => false);
    setStatus(copied ? "copied" : "failed");
    window.setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <button type="button" onClick={share} aria-live="polite" className={`${className} cursor-pointer`}>
      <TrailIcon name={status === "copied" ? "check" : "share"} />
      {WORDS[status]}
    </button>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { useEffect, useState } from "react";

import { emailShareUrl, whatsAppShareUrl } from "@/lib/share";

type ShareButtonsProps = {
  /** Full URL of the page. */
  url: string;
  title: string;
};

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_TEXT: Record<CopyStatus, string> = { idle: "", copied: "Link copied", failed: "Could not copy the link" };

const ROUND =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/35 transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const ShareLink = ({ href, label, icon, className = "" }: { href: string; label: string; icon: IconName; className?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${ROUND} ${className}`}>
    <Icon name={icon} size={17} />
  </a>
);

/** Copy link, share on WhatsApp, share by email (on the article hero). */
export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const [status, setStatus] = useState<CopyStatus>("idle");

  // The "Link copied" note fades after a moment.
  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      // Blocked clipboard (permissions, insecure page): say so instead of failing silently.
      setStatus("failed");
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 print:hidden">
      <button type="button" onClick={copyLink} aria-label="Copy link" className={`${ROUND} text-white`}>
        <Icon name={status === "copied" ? "check" : "link"} size={17} />
      </button>
      <ShareLink href={whatsAppShareUrl(`${title} ${url}`)} label="Share on WhatsApp" icon="chat" className="text-whatsapp-on-dark" />
      <ShareLink href={emailShareUrl({ subject: title, body: url })} label="Share by email" icon="mail" className="text-white" />
      <p
        aria-live="polite"
        className="absolute top-full right-0 mt-2 rounded-md bg-white px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-ink empty:hidden"
      >
        {STATUS_TEXT[status]}
      </p>
    </div>
  );
};

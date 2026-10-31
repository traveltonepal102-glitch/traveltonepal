import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { VIDEOS_PATH } from "@/features/videos/constants";

type MediaLibraryHeaderProps = {
  tab: "photos" | "videos";
  /** What the open tab holds and how it works. */
  description: ReactNode;
  /** The tab's own button, e.g. "Upload photos". */
  action: ReactNode;
};

const TABS = [
  { key: "photos", label: "Photos", icon: "photo_library", href: ADMIN_SECTIONS.photos.href },
  { key: "videos", label: "YouTube videos", icon: "smart_display", href: VIDEOS_PATH },
] as const;

const TAB =
  "inline-flex min-h-10 items-center gap-1.5 rounded-md border border-solid px-3.5 text-body-sm font-bold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** The top of the Photos and videos screen: the heading, the Photos / YouTube videos switch and the open tab's button. */
export const MediaLibraryHeader = ({ tab, description, action }: MediaLibraryHeaderProps) => (
  <>
    <div className="flex flex-wrap items-start gap-3.5">
      <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon name={tab === "photos" ? "photo_library" : "smart_display"} size={26} />
      </span>
      <div className="min-w-60 flex-1">
        <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{ADMIN_SECTIONS.photos.label}</h1>
        <p className="m-0 mt-1 max-w-195 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
    <nav aria-label="Photos or videos" className="flex flex-wrap gap-1.5">
      {TABS.map((entry) => (
        <Link
          key={entry.key}
          href={entry.href}
          aria-current={entry.key === tab ? "page" : undefined}
          className={cn(TAB, entry.key === tab ? "border-brand bg-brand-tint text-brand" : "border-border bg-surface text-text hover:border-brand hover:text-brand")}
        >
          <Icon name={entry.icon} size={18} />
          {entry.label}
        </Link>
      ))}
    </nav>
  </>
);

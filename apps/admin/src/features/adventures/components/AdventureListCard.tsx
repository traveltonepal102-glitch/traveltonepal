import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { adventurePath } from "../constants";
import type { Adventure } from "../types";

/** One adventure in the list: photo, place in the carousel, title, tag and whether the website shows it. Opens the edit panel. */
export const AdventureListCard = ({ adventure, isOpen }: { adventure: Adventure; isOpen: boolean }) => (
  <Link
    href={adventurePath(adventure.id)}
    scroll={false}
    aria-current={isOpen ? "true" : undefined}
    className={cn(
      "flex h-full flex-col overflow-hidden rounded-lg border border-solid bg-surface text-text no-underline hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      isOpen ? "border-brand ring-3 ring-brand/15" : "border-border",
      !adventure.isShown && "bg-page",
    )}
  >
    <span className="relative flex aspect-16/9 items-center justify-center bg-page text-subtle">
      {adventure.photo ? (
        <PhotoImage photo={adventure.photo} alt="" sizes="(min-width: 1024px) 360px, 100vw" className="h-full w-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-1 text-caption">
          <Icon name="add_photo_alternate" size={28} />
          No photo yet
        </span>
      )}
      <span className="absolute top-2 left-2 rounded-full bg-surface/90 px-2.5 py-0.5 text-xs font-bold text-ink">#{adventure.position}</span>
    </span>
    <span className="flex flex-1 flex-col gap-1.5 p-4">
      <span className="flex items-start justify-between gap-2">
        <span className="font-bold text-ink">{adventure.title}</span>
        <span
          className={cn(
            "inline-flex flex-none items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
            adventure.isShown ? "bg-green-tint text-whatsapp" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon name={adventure.isShown ? "visibility" : "visibility_off"} size={14} />
          {adventure.isShown ? "On website" : "Hidden"}
        </span>
      </span>
      {adventure.tag && <span className="text-xs font-semibold text-saffron-ink">{adventure.tag}</span>}
      <span className="line-clamp-3 text-caption">{adventure.summary}</span>
    </span>
  </Link>
);

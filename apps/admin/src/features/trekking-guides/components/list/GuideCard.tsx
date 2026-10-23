import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { guidePath } from "../../constants";
import { roleLine } from "../../lib/guideRules";
import type { LicenceStatus, TrekkingGuide } from "../../types";

type GuideCardProps = {
  guide: TrekkingGuide;
  regionNames: string[];
  licence: LicenceStatus;
  isOpen: boolean;
};

/** One guide in the list (design: people card). Opens the edit panel. */
export const GuideCard = ({ guide, regionNames, licence, isOpen }: GuideCardProps) => {
  const isOnWebsite = guide.showOnAbout || guide.canLeadTreks;

  return (
    <Link
      href={guidePath(guide.id)}
      scroll={false}
      aria-current={isOpen ? "true" : undefined}
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border border-solid bg-surface p-4 text-text no-underline hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isOpen ? "border-brand ring-3 ring-brand/15" : "border-border",
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn("inline-flex size-13 flex-none items-center justify-center overflow-hidden rounded-full", isOnWebsite ? "bg-brand-tint text-brand" : "bg-muted text-subtle")}>
          {guide.photo ? <PhotoImage photo={guide.photo} alt="" sizes="52px" className="h-full w-full object-cover" /> : <Icon name="person" size={26} />}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 font-bold text-ink">
            <span className="truncate">{guide.name}</span>
            {licence === "valid" && <Icon name="verified" size={16} aria-label="Licence checked" className="flex-none text-brand" />}
            {licence === "expired" && <Icon name="warning" size={16} aria-label="Licence expired" className="flex-none text-saffron-ink" />}
          </span>
          <span className="block truncate text-caption text-muted-foreground">{roleLine(guide)}</span>
        </span>
      </span>

      {regionNames.length > 0 && (
        <span className="flex flex-wrap gap-1.5">
          {regionNames.map((region) => (
            <span key={region} className="rounded-full bg-page px-2.5 py-0.5 text-xs font-semibold text-text">
              {region}
            </span>
          ))}
        </span>
      )}
      {guide.languages.length > 0 && (
        <span className="flex items-center gap-1.5 text-caption">
          <Icon name="translate" size={16} className="flex-none text-muted-foreground" />
          <span className="truncate">{guide.languages.join(", ")}</span>
        </span>
      )}

      <span className="mt-auto flex items-center justify-between gap-2 border-t border-solid border-border pt-2.5 text-xs">
        <span className="text-muted-foreground">{guide.treks.length === 1 ? "1 trek" : `${guide.treks.length} treks`}</span>
        <span className={cn("inline-flex items-center gap-1.5 font-bold", isOnWebsite ? "text-whatsapp" : "text-muted-foreground")}>
          <span aria-hidden="true" className={cn("size-2 rounded-full", isOnWebsite ? "bg-whatsapp" : "bg-subtle")} />
          {isOnWebsite ? "On website" : "Hidden"}
        </span>
      </span>
    </Link>
  );
};

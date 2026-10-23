import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { MonthRating } from "@/lib/supabase/database.types";

import { MONTH_NAMES, MONTH_RATING_LABELS, regionPath } from "../../constants";
import type { RegionCardItem } from "../../lib/regionCard";

const BAR_CLASSES: Record<MonthRating, string> = {
  best: "bg-month-best",
  possible: "bg-month-possible",
  avoid: "bg-month-avoid",
};

type RegionCardProps = {
  region: RegionCardItem;
};

/** One region on the Regions list (design: .ad-rcard). Photos come later, so the top is a navy panel. */
export const RegionCard = ({ region }: RegionCardProps) => {
  const isComplete = region.doneCount === region.sectionCount;

  return (
    <Link
      href={regionPath(region.id)}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-solid border-border bg-surface text-text no-underline shadow-card transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative flex h-30 items-end overflow-hidden bg-navy p-3.5 text-white">
        {region.cover ? (
          <>
            <PhotoImage
              photo={region.cover}
              alt=""
              sizes="(min-width: 1101px) 380px, (min-width: 701px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-linear-to-b from-navy/0 from-30% to-navy/85" />
          </>
        ) : (
          <Icon name="landscape" size={72} className="absolute top-3 right-3 text-white/10" />
        )}
        <span className="relative">
          <span className="block font-display text-xl font-extrabold">{region.name}</span>
          <span className="block text-xs text-navy-text">
            {region.district || "No district yet"} · {region.websiteDomain ?? "No own website yet"}
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div>
          <div className="grid grid-cols-12 gap-0.5" role="img" aria-label={region.bestMonths ? `Best months: ${region.bestMonths}` : "No best months yet"}>
            {region.monthRatings.map((rating, month) => (
              <span key={MONTH_NAMES[month]} title={`${MONTH_NAMES[month]}: ${MONTH_RATING_LABELS[rating]}`} className={cn("h-2.5 rounded-xs", BAR_CLASSES[rating])} />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-subtle" aria-hidden="true">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        <p className="m-0 text-caption text-muted-foreground">{region.bestMonths ? `Best: ${region.bestMonths}` : "Best months not set"}</p>

        <p className={cn("m-0 mt-auto flex items-center gap-1.5 text-xs font-bold", isComplete ? "text-whatsapp" : "text-saffron-deep")}>
          <Icon name={isComplete ? "check_circle" : "warning"} size={16} className="flex-none" />
          {isComplete ? "Everything filled in" : `${region.doneCount} of ${region.sectionCount} ready · ${region.nextStep}`}
        </p>
      </div>
    </Link>
  );
};

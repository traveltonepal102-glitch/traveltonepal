import { SiteImage } from "@/components/ui/SiteImage";
import { formatAltitude } from "@/features/treks/format";

import type { ItineraryDay } from "../../types";

/** Colors of a normal day and of the high-point day (saffron, as in the design). */
const LOOKS = {
  normal: {
    card: "border border-line shadow-card",
    head: "",
    badge: "bg-brand text-on-brand",
    subtitle: "text-muted-foreground",
    chip: "border-green-line bg-green-tint font-semibold text-whatsapp",
    divider: "border-muted",
  },
  highPoint: {
    card: "border-2 border-saffron shadow-[0_6px_16px_rgba(15,23,42,0.08)]",
    head: "bg-saffron-tint",
    badge: "bg-saffron text-ink",
    subtitle: "text-saffron-ink",
    chip: "border-saffron-line bg-saffron/25 font-bold text-ink",
    divider: "border-saffron-line",
  },
} as const;

/** "6–7 hrs · 2,470 m", with "high point" on the trek's highest day. */
const dayStats = (day: ItineraryDay) =>
  [day.duration, formatAltitude(day.altitudeM), day.isHighPoint ? "High point" : undefined].filter(Boolean).join(" · ");

type ItineraryDayCardProps = { day: ItineraryDay; dayNumber: number };

/** One day: number, title, time and altitude, then the description and an optional photo. */
export const ItineraryDayCard = ({ day, dayNumber }: ItineraryDayCardProps) => {
  const look = LOOKS[day.isHighPoint ? "highPoint" : "normal"];

  return (
    <article className={`overflow-hidden rounded-lg bg-surface ${look.card}`}>
      <div className={`flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${look.head}`}>
        <div className="flex min-w-0 items-center gap-3.5">
          <span aria-hidden="true" className={`flex-none rounded-sm px-3 py-1.5 font-display text-xs font-extrabold ${look.badge}`}>
            DAY {String(dayNumber).padStart(2, "0")}
          </span>
          <div className="flex min-w-0 flex-col">
            <h3 className="text-base leading-snug font-bold">
              <span className="sr-only">Day {dayNumber}: </span>
              {day.title}
            </h3>
            <p className={`text-xs font-semibold ${look.subtitle}`}>{day.subtitle}</p>
          </div>
        </div>
        <p className={`flex-none self-start rounded-sm border px-2.5 py-1 text-xs ${look.chip}`}>{dayStats(day)}</p>
      </div>

      <div className={`flex flex-wrap gap-4 border-t px-5 pt-4 pb-5 ${look.divider}`}>
        {day.photo && (
          <div className="relative h-42.5 w-full flex-none overflow-hidden rounded-md border border-line sm:h-28 sm:w-40">
            <SiteImage image={day.photo} sizes="(min-width: 640px) 160px, 100vw" className="object-cover" />
          </div>
        )}
        <p className="min-w-0 flex-[1_1_260px] text-body-sm text-text">{day.text}</p>
      </div>
    </article>
  );
};

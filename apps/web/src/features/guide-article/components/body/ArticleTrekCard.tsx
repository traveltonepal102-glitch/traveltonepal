import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { formatAltitude, formatDays, formatUsd } from "@/features/treks/format";
import type { TrekSummary } from "@/features/treks/types";

import { FOCUS, KICKER } from "../styles";
import { TrekPhoto } from "../TrekPhoto";
import { trekHref } from "../trekHref";

/** "Trek mentioned in this guide": photo, name, key facts and a link to the trek. */
export const ArticleTrekCard = ({ trek }: { trek: TrekSummary }) => (
  <aside aria-label="Trek mentioned in this guide" className="flex flex-col gap-4.5 rounded-2xl border border-line bg-page p-4.5 sm:flex-row sm:items-center">
    <div className="relative aspect-video w-full flex-none overflow-hidden rounded-xl bg-brand-tint sm:aspect-auto sm:h-26 sm:w-35">
      <TrekPhoto trek={trek} sizes="(min-width: 640px) 140px, 100vw" />
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className={`${KICKER} text-brand`}>Trek mentioned in this guide</p>
      <p className="font-display text-[19px] font-bold text-ink">{trek.name}</p>
      <p className="text-caption font-normal text-text">
        {formatDays(trek.days)} · {trek.difficulty} · max {formatAltitude(trek.maxAltitudeM)}
        {trek.priceFromUsd !== undefined && (
          <>
            {" "}
            · from <strong className="text-brand">{formatUsd(trek.priceFromUsd)}</strong>
          </>
        )}
      </p>
    </div>
    <Link
      href={trekHref(trek)}
      className={`inline-flex min-h-11 flex-none items-center justify-center gap-1.5 rounded-md bg-brand px-4.5 font-bold text-on-brand hover:bg-brand-hover ${FOCUS}`}
    >
      View trek
      <Icon name="arrow_forward" size={16} />
    </Link>
  </aside>
);

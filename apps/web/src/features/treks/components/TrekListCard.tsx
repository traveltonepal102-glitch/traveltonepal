import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";
import { Fragment } from "react";

import { hasTrekPage } from "@/features/trek-detail/trekDetails";
import { formatCount } from "@/lib/format";
import { trekPath } from "@/lib/routes";

import { formatAltitude, formatUsd } from "../format";
import { trekInquiryUrl } from "../inquiry";
import type { TrekSummary } from "../types";
import { CARD_FOCUS_RING, STRETCHED_LINK } from "./cardStyles";
import { DifficultyChip } from "./DifficultyChip";
import { TrekCardMedia } from "./TrekCardMedia";

/**
 * Month ranges like "Oct–Nov" never break at the dash ("Mar–May, / Oct–Nov"); parts with spaces
 * ("All year except monsoon") still wrap normally. The ", " sits outside the no-wrap span so the
 * line can break after it.
 */
const Fact = ({ icon, label, value }: { icon: IconName; label: string; value: string }) => (
  <li className="flex min-w-0 flex-col items-start gap-0.5">
    <Icon name={icon} size={16} className="text-brand" />
    <span className="font-bold">
      <span className="sr-only">{label}: </span>
      {value.split(", ").map((part, index) => (
        <Fragment key={part}>
          {index > 0 && ", "}
          <span className={part.includes(" ") ? undefined : "whitespace-nowrap"}>{part}</span>
        </Fragment>
      ))}
    </span>
  </li>
);

/**
 * Compact trek card for the Treks page results (design: Treks.dc.html). One main link plus "Ask". A trek
 * without its page yet is one WhatsApp link instead (like the region pages), never a 404.
 */
export const TrekListCard = ({ trek }: { trek: TrekSummary }) => {
  const hasPage = hasTrekPage(trek.slug);

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-shadow hover:shadow-raised ${CARD_FOCUS_RING}`}
    >
      <TrekCardMedia
        trek={trek}
        className="aspect-16/10"
        sizes="(min-width: 1280px) 440px, (min-width: 1024px) 34vw, (min-width: 768px) 48vw, 100vw"
        showBadge
      />

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <DifficultyChip difficulty={trek.difficulty} />
        <h3 className="text-h4">
          {hasPage ? (
            <Link href={trekPath(trek.slug)} data-trek-link className={STRETCHED_LINK}>
              {trek.name}
            </Link>
          ) : (
            <a href={trekInquiryUrl(trek)} target="_blank" rel="noopener noreferrer" data-trek-link className={STRETCHED_LINK}>
              {trek.name}
              <span className="sr-only">: ask about it on WhatsApp</span>
            </a>
          )}
        </h3>
        {trek.summary && <p className="text-caption font-normal text-text">{trek.summary}</p>}

        <ul className="grid grid-cols-3 gap-1.5 border-y border-muted py-2.5 text-xs text-text">
          <Fact icon="calendar_month" label="Length" value={formatCount(trek.days, "day")} />
          <Fact icon="altitude" label="Highest point" value={formatAltitude(trek.maxAltitudeM)} />
          {trek.seasonLabel && <Fact icon="wb_sunny" label="Best months" value={trek.seasonLabel} />}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-2">
          {trek.priceFromUsd ? (
            <p className="flex flex-col leading-tight">
              <span className="text-xs text-muted-foreground">From</span>
              <span className="font-display text-h3 font-extrabold text-brand">{formatUsd(trek.priceFromUsd)}</span>
              <span className="text-xs text-muted-foreground">per person</span>
            </p>
          ) : (
            <p className="font-display text-h4 text-brand">Price on request</p>
          )}
          {trek.hasFixedDates && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-green-tint px-2 py-0.5 text-xs font-bold text-whatsapp">
              <Icon name="calendar_month" size={13} />
              Fixed dates
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <span
            aria-hidden="true"
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md text-body-sm font-bold ${hasPage ? "bg-brand text-on-brand" : "bg-whatsapp text-white"}`}
          >
            {hasPage ? "View trek" : "Ask about this trek"}
            <Icon name={hasPage ? "arrow_forward" : "chat"} size={16} />
          </span>
          {hasPage && (
            <a
              href={trekInquiryUrl(trek)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask about the ${trek.name} on WhatsApp`}
              className="relative z-10 inline-flex min-h-11 flex-none items-center gap-1.5 rounded-md border border-green-line bg-green-tint px-3.5 text-body-sm font-bold text-whatsapp transition-colors hover:bg-green-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Icon name="chat" size={18} />
              Ask
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

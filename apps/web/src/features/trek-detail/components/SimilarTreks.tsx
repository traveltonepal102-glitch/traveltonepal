import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { formatDays, formatUsd } from "@/features/treks/format";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import type { TrekSummary } from "@/features/treks/types";
import { trekPath } from "@/lib/routes";

import { SectionHeading } from "./SectionHeading";

/** Tag colors, used in turn (as in the design). */
const TAG_TONES = [
  "bg-saffron-tint text-saffron-ink",
  "bg-green-tint text-whatsapp",
  "bg-brand-tint text-brand",
  "bg-navy/10 text-navy",
] as const;

const ACTION = "inline-flex items-center gap-0.5 rounded-sm text-xs font-bold text-ink hover:text-brand focus-visible:outline-2 focus-visible:outline-ring";

/** Links to the trek's page, or, while it has none yet, to a WhatsApp chat about it. */
const TrekAction = ({ trek }: { trek: TrekSummary }) =>
  trek.hasPage ? (
    <Link href={trekPath(trek.slug)} className={ACTION}>
      View route
      <span className="sr-only">: {trek.name}</span>
      <Icon name="arrow_forward" size={14} />
    </Link>
  ) : (
    <a href={trekInquiryUrl(trek)} target="_blank" rel="noopener noreferrer" className={ACTION}>
      Ask on WhatsApp
      <span className="sr-only">about the {trek.name}</span>
      <Icon name="arrow_forward" size={14} />
    </a>
  );

/** "Explore more of the Himalaya": the treks picked for this one (trekPageRows). */
export const SimilarTreks = ({ treks }: { treks: readonly TrekSummary[] }) => (
  <section aria-labelledby="similar-treks-title" className="flex flex-col gap-4">
    <SectionHeading
      id="similar-treks-title"
      eyebrow="Explore more of the Himalaya"
      title="Similar trekking options in Nepal"
      description="Treks planned with you and led by local guides."
    />
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {treks.map((other, index) => (
        <li key={other.slug} className="flex flex-col justify-between gap-3 rounded-lg border border-line bg-page p-4 shadow-card">
          <div className="flex flex-col gap-2">
            <p className={`self-start rounded-xs px-2 py-0.5 text-[10px] font-bold uppercase ${TAG_TONES[index % TAG_TONES.length]}`}>
              {formatDays(other.days)} · {other.difficulty}
            </p>
            <h3 className="text-base font-bold">{other.name}</h3>
            <p className="text-xs text-text">{other.summary}</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
            <p className="text-body-sm font-bold text-brand">
              {other.priceFromUsd ? `From ${formatUsd(other.priceFromUsd)}` : "Price on request"}
            </p>
            <TrekAction trek={other} />
          </div>
        </li>
      ))}
    </ul>
  </section>
);

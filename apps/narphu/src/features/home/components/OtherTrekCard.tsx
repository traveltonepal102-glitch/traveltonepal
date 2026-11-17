import { getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatAltitude, formatDays, formatUsd } from "@/lib/format";

import type { HomeTrekCard } from "../types";

/** One of the trek's facts as a small labelled figure: its own <dl>, as a <dl> may hold only <dt>/<dd> pairs, not the icon. */
const Fact = ({ icon, label, value }: { icon: TrailIconName; label: string; value: string }) => (
  <li className="flex items-center gap-2.5">
    <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center rounded-full bg-cream text-maroon">
      <TrailIcon name={icon} size={16} />
    </span>
    <dl className="m-0 leading-5">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="m-0 font-semibold text-ink">{value}</dd>
    </dl>
  </li>
);

/**
 * One of the website's other treks as a wide card (design: Other treks we guide): its photo on one side; its facts, its
 * summary, the price and the way to its page on the other. Without a page yet, it asks on WhatsApp.
 */
export const OtherTrekCard = ({ trek }: { trek: HomeTrekCard }) => {
  const facts = [
    trek.days ? { icon: "calendar" as const, label: "Duration", value: formatDays(trek.days) } : null,
    trek.maxAltitudeM ? { icon: "mountain" as const, label: "Highest point", value: formatAltitude(trek.maxAltitudeM) } : null,
    trek.difficulty ? { icon: "trend" as const, label: "Difficulty", value: trek.difficulty } : null,
    trek.season ? { icon: "sun" as const, label: "Best season", value: trek.season } : null,
  ].filter((fact) => fact !== null);

  return (
    <article className="group flex flex-wrap overflow-hidden rounded-[22px] border border-solid border-line bg-snow shadow-card">
      <div className="relative min-h-72 flex-[1_1_380px] overflow-hidden bg-maroon-tint">
        {trek.image && <SiteImage image={trek.image} sizes="(min-width: 1024px) 520px, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" />}
        {trek.region && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-snow/95 px-3 py-1 text-[13px] leading-4.5 font-semibold text-maroon-deep">
            <TrailIcon name="pin" size={14} />
            {trek.region}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-[1.4_1_440px] flex-col gap-5 p-8 max-sm:p-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-[28px]! leading-8.5!">
            {trek.hasPage ? (
              <Link href={trek.href} className="text-ink no-underline hover:text-maroon">
                {trek.name}
              </Link>
            ) : (
              trek.name
            )}
          </h3>
          {trek.summary && <p className="m-0 text-[17px] leading-7">{trek.summary}</p>}
        </div>
        {facts.length > 0 && (
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-4 gap-y-3.5 rounded-2xl bg-paper p-4">
            {facts.map((fact) => (
              <Fact key={fact.label} {...fact} />
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-0 border-t border-solid border-line pt-4.5">
          {trek.priceFromUsd !== null ? (
            <p className="m-0 flex items-baseline gap-1.5 text-muted">
              From <strong className="text-[28px] leading-8 font-semibold text-maroon">{formatUsd(trek.priceFromUsd)}</strong> per person
            </p>
          ) : (
            <span className="text-xl font-semibold text-maroon">Price on request</span>
          )}
          {trek.hasPage ? (
            <Link href={trek.href} className={primaryButton}>
              View trek
              <TrailIcon name="arrow" size={16} />
            </Link>
          ) : (
            <a href={getWhatsAppUrl(`Hello! I would like to know about the ${trek.name}.`)} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
              <WhatsAppLogo />
              Ask us
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

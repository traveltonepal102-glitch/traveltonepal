import { getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { formatAltitude, formatDays, formatUsd } from "@/lib/format";
import { pagePath } from "@/lib/routes";

import type { HomeTrekCard } from "../types";

/** One of the website's other treks; without a page yet, it asks on WhatsApp. */
export const OtherTrekCard = ({ trek }: { trek: HomeTrekCard }) => (
  <article className="flex flex-col overflow-hidden rounded-2xl border border-solid border-line bg-snow shadow-card">
    <div className="relative aspect-16/10 bg-forest-tint">
      {trek.image && <SiteImage image={trek.image} sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />}
      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-eyebrow font-semibold text-forest-deep">
        <TrailIcon name="pin" size={14} />
        {trek.region}
      </span>
      {trek.days && <span className="absolute right-3.5 bottom-3.5 rounded-full bg-forest-deep/90 px-3 py-1 text-sm leading-5 font-semibold text-snow">{formatDays(trek.days)}</span>}
    </div>
    <div className="flex flex-1 flex-col gap-3.5 px-5.5 pt-5 pb-5.5">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[23px]! leading-7.25!">
          {trek.hasPage ? (
            <Link href={pagePath(trek.slug)} className="text-ink no-underline">
              {trek.name}
            </Link>
          ) : (
            trek.name
          )}
        </h3>
        {trek.summary && <p className="text-base leading-6">{trek.summary}</p>}
      </div>
      <ul className="flex flex-wrap gap-x-4.5 gap-y-1.5 text-sm leading-5 text-muted">
        <li className="inline-flex items-center gap-1.5">
          <TrailIcon name="trend" size={16} className="text-forest" />
          {trek.difficulty}
        </li>
        {trek.maxAltitudeM && (
          <li className="inline-flex items-center gap-1.5">
            <TrailIcon name="mountain" size={16} className="text-forest" />
            Max {formatAltitude(trek.maxAltitudeM)}
          </li>
        )}
        {trek.season && (
          <li className="inline-flex items-center gap-1.5">
            <TrailIcon name="sun" size={16} className="text-forest" />
            {trek.season}
          </li>
        )}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-solid border-line pt-4">
        {trek.priceFromUsd !== null ? (
          <span className="flex flex-col text-eyebrow text-muted">
            From
            <strong className="font-display text-2xl leading-7.5 font-[640] text-forest">{formatUsd(trek.priceFromUsd)}</strong>
          </span>
        ) : (
          <span className="font-display text-xl leading-6.5 font-semibold text-forest">Price on request</span>
        )}
        {trek.hasPage ? (
          <Link href={pagePath(trek.slug)} className={primaryButton}>
            View trek
            <TrailIcon name="arrow" size={16} />
          </Link>
        ) : (
          <a href={getWhatsAppUrl(`Hello! I would like to know about the ${trek.name}.`)} className={whatsAppButton}>
            <WhatsAppLogo />
            Ask us
          </a>
        )}
      </div>
    </div>
  </article>
);

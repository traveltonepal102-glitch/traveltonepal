import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { formatAltitude } from "@/features/treks/format";
import { formatCount } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import type { SitePageTop } from "@/features/site-pages/types";

import { WRAP } from "./styles";

type RegionsHeroProps = {
  top: SitePageTop;
  regionCount: number;
  trekCount: number;
  /** Lowest and highest "highest point" of the regions, in metres; none without regions. */
  altitudeRange?: { min: number; max: number };
};

/** Regions page hero: breadcrumb, title, intro and four quick facts over a valley photo. */
export const RegionsHero = ({ top, regionCount, trekCount, altitudeRange }: RegionsHeroProps) => {
  // A count of zero isn't a fact worth showing.
  const stats: readonly { icon: IconName; text: string }[] = [
    ...(regionCount > 0 ? [{ icon: "landscape" as const, text: formatCount(regionCount, "region") }] : []),
    ...(trekCount > 0 ? [{ icon: "hiking" as const, text: formatCount(trekCount, "trek") }] : []),
    ...(altitudeRange ? [{ icon: "mountain_flag" as const, text: `From ${formatAltitude(altitudeRange.min)} to ${formatAltitude(altitudeRange.max)}` }] : []),
    { icon: "verified", text: "All permits arranged" },
  ];

  return (
    <section aria-labelledby="regions-title" className="relative overflow-hidden bg-navy text-white">
      {/* Decorative: the title says what the page is. */}
      <Image src="/images/trekkers-on-trail.jpg" alt="" fill preload sizes="100vw" className="object-cover object-[50%_45%]" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-navy/94 via-navy/72 via-55% to-navy/30" />

      <div className={`${WRAP} relative flex flex-col gap-4 pt-5.5 pb-12`}>
        <Breadcrumbs tone="onDark" items={[{ label: "Home", href: ROUTES.home }, { label: "Regions" }]} />
        {top.eyebrow && <p className="text-eyebrow text-saffron uppercase">{top.eyebrow}</p>}
        <h1 id="regions-title" className="max-w-195 text-[30px] leading-[1.08] font-extrabold tracking-tight text-white md:text-[44px]">
          {top.heading}
        </h1>
        {top.intro && <p className="max-w-160 text-base text-white/85">{top.intro}</p>}
        <ul className="flex flex-wrap gap-2 pt-1">
          {stats.map((stat) => (
            <li key={stat.text} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-caption font-semibold">
              <Icon name={stat.icon} size={16} className="text-saffron" />
              {stat.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

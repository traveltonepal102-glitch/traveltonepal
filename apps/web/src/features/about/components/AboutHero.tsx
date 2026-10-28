import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import type { SitePageTop } from "@/features/site-pages/types";
import type { SiteImageSource } from "@/lib/images";
import { ROUTES } from "@/lib/routes";

import { WRAP } from "./styles";

export type AboutStat = { value: string; label: string };

/** Decorative (the title says what the page is), until a photo is picked in Pages › About. */
const DEFAULT_PHOTO: SiteImageSource = { src: "/images/kyanjin-gompa-prayer-wheels.jpg", alt: "" };

/**
 * Photo hero (design: About.dc.html): breadcrumb, label, title, intro (from Pages › About) and up to four numbers.
 * Its tall bottom leaves room for the four beliefs' cards, which sit over it.
 */
export const AboutHero = ({ top, stats }: { top: SitePageTop; stats: readonly AboutStat[] }) => (
  <section aria-labelledby="about-title" className="relative overflow-hidden bg-navy text-white">
    <SiteImage image={top.cover ? { ...top.cover, alt: "" } : DEFAULT_PHOTO} priority sizes="100vw" className="object-cover object-[50%_35%]" />
    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/85 via-navy/55 via-40% to-navy/97" />

    <div className={`${WRAP} relative flex flex-col items-start gap-5.5 pt-8 pb-44 md:pt-14`}>
      <Breadcrumbs tone="onDark" items={[{ label: "Home", href: ROUTES.home }, { label: "About us" }]} />
      {top.eyebrow && <p className="text-eyebrow text-saffron uppercase">{top.eyebrow}</p>}
      <h1 id="about-title" className="max-w-215 text-[36px] leading-10 font-extrabold tracking-tight text-white md:text-[60px] md:leading-16">
        {top.heading}
      </h1>
      {top.intro && <p className="max-w-160 text-[19px] leading-[30px] text-line">{top.intro}</p>}
      {stats.length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-3.5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="text-[13px] text-navy-text">{stat.label}</dt>
              <dd className="font-display text-[30px] leading-[34px] font-extrabold text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  </section>
);

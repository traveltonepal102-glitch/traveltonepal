import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import type { SitePageTop } from "@/features/site-pages/types";
import type { SiteImageSource } from "@/lib/images";
import { ROUTES } from "@/lib/routes";

import { WRAP } from "./styles";

export type AboutStat = { value: string; label: string };

/** Decorative (the title says what the page is), until a photo is picked in Pages › About. */
const DEFAULT_PHOTO: SiteImageSource = { src: "/images/kyanjin-gompa-prayer-wheels.jpg", alt: "" };

/** Photo hero: breadcrumb, label, title, intro (from Pages › About) and up to four quick stats. */
export const AboutHero = ({ top, stats }: { top: SitePageTop; stats: readonly AboutStat[] }) => (
  <section aria-labelledby="about-title" className="relative overflow-hidden bg-navy text-white">
    <SiteImage image={top.cover ? { ...top.cover, alt: "" } : DEFAULT_PHOTO} priority sizes="100vw" className="object-cover object-[62%_40%]" />
    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-navy/95 via-navy/80 via-50% to-navy/40" />

    <div className={`${WRAP} relative flex flex-col gap-4 pt-5.5 pb-10`}>
      <Breadcrumbs tone="onDark" items={[{ label: "Home", href: ROUTES.home }, { label: "About us" }]} />
      {top.eyebrow && <p className="text-eyebrow text-saffron uppercase">{top.eyebrow}</p>}
      <h1 id="about-title" className="max-w-190 text-h1-sm tracking-tight text-white md:text-h1">
        {top.heading}
      </h1>
      {top.intro && <p className="max-w-155 text-body-lg text-white/85">{top.intro}</p>}
      <dl className="grid max-w-205 grid-cols-2 gap-3 pt-2.5 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse rounded-xl border border-white/18 bg-white/10 px-4 py-3.5">
            <dt className="text-caption font-normal text-navy-text">{stat.label}</dt>
            <dd className="font-display text-[26px] leading-tight font-extrabold">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

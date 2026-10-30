import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { formatCount } from "@/lib/format";
import { HERO_PHOTO_QUALITY } from "@/lib/images";
import { ROUTES } from "@/lib/routes";
import type { SitePageTop } from "@/features/site-pages/types";

import { TrekSearchForm } from "./TrekSearchForm";

type TreksHeroProps = {
  /** From Pages › List pages › Treks. */
  top: SitePageTop;
  trekCount: number;
  regionCount: number;
};

/** Treks page hero (design: Treks.dc.html): breadcrumb, title, intro, quick facts and trek search. */
export const TreksHero = ({ top, trekCount, regionCount }: TreksHeroProps) => {
  // A count of zero isn't a fact worth showing.
  const facts: readonly { icon: IconName; text: string }[] = [
    ...(trekCount > 0 ? [{ icon: "hiking" as const, text: formatCount(trekCount, "trek") }] : []),
    ...(regionCount > 0 ? [{ icon: "landscape" as const, text: formatCount(regionCount, "region") }] : []),
    { icon: "groups", text: "Private, on your dates" },
    { icon: "verified", text: "Licensed local operator" },
  ];

  return (
    <section aria-labelledby="treks-title" className="relative overflow-hidden bg-navy text-white">
      {/* Decorative: the title says what the page is. */}
      <Image
        src="/images/langtang-glacier-peaks.jpg"
        alt=""
        fill
        preload
        fetchPriority="high"
        quality={HERO_PHOTO_QUALITY}
        sizes="100vw"
        className="object-cover object-[50%_40%]"
      />
      {/* Phones get stronger shading: the text runs across the bright right side of the photo there too. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-navy/95 via-navy/85 to-navy/70 md:via-navy/75 md:via-55% md:to-navy/35"
      />

      <div className="relative mx-auto flex max-w-content flex-col gap-4 px-4 pt-5.5 pb-11 md:px-6">
        <Breadcrumbs tone="onDark" items={[{ label: "Home", href: ROUTES.home }, { label: "Treks" }]} />
        {top.eyebrow && <p className="text-eyebrow text-saffron uppercase">{top.eyebrow}</p>}
        <h1 id="treks-title" className="max-w-190 text-h1-sm tracking-tight text-white md:text-h1">
          {top.heading}
        </h1>
        {top.intro && <p className="max-w-160 text-body-lg text-white/85">{top.intro}</p>}
        <ul className="flex flex-wrap gap-2 pt-1">
          {facts.map((fact) => (
            <li
              key={fact.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-caption font-semibold"
            >
              <Icon name={fact.icon} size={16} className="text-saffron" />
              {fact.text}
            </li>
          ))}
        </ul>
        <TrekSearchForm />
      </div>
    </section>
  );
};

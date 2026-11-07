import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import type { SitePageTop } from "@/features/site-pages/types";
import { ROUTES } from "@/lib/routes";

export type AboutStat = { value: string; label: string };

/** The title band: breadcrumb, H1, intro and the company's numbers beside the page's photo. */
export const AboutHero = ({ top, stats }: { top: SitePageTop; stats: readonly AboutStat[] }) => (
  <div className="border-0 border-b border-solid border-line bg-stone">
    <div className="wrap grid items-center gap-x-12 gap-y-8 pt-6 pb-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "About us" }]} />
        <h1>{top.heading}</h1>
        {top.intro && <p className="max-w-[62ch] text-[19px] leading-7.5">{top.intro}</p>}
        {stats.length > 0 && (
          <dl className="mt-2 grid gap-3 border-0 border-t border-solid border-line pt-5 sm:grid-cols-[repeat(auto-fit,minmax(130px,1fr))] sm:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-row-reverse items-baseline justify-end gap-3 sm:flex-col-reverse sm:items-start sm:gap-0.5">
                <dt className="text-sm leading-5 text-muted">{stat.label}</dt>
                <dd className="font-display text-[28px] leading-8.5 font-semibold text-forest">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {top.cover && (
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-forest-tint">
          {/* Decorative: the title says what the page is. */}
          <SiteImage image={{ ...top.cover, alt: "" }} isPriority sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
        </div>
      )}
    </div>
  </div>
);

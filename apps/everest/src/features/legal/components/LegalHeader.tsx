import Link from "next/link";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import { legalReadingMinutes } from "../legalReading";
import { LEGAL_PAGES } from "../legalPages";
import type { LegalDoc } from "../types";

const CHIP = "inline-flex min-h-8.5 items-center gap-2 rounded-full border border-solid border-ice-strong bg-snow px-3.5 text-sm leading-5 font-semibold text-text";

/** Topographic lines on the band's right side (the brand's contour motif): decoration only. */
const Contours = () => (
  <svg aria-hidden="true" viewBox="0 0 900 360" className="absolute -top-10 -right-30 h-105 w-225 max-md:hidden">
    {Array.from({ length: 7 }, (_, ring) => {
      const rx = 120 + ring * 46;
      const ry = 70 + ring * 30;
      return (
        <path
          key={ring}
          d={`M${560 - rx} 170 C${560 - rx} ${170 - ry * 1.1} ${560 + rx * 0.8} ${170 - ry * 1.25} ${560 + rx} ${170 - ry * 0.2} C${560 + rx * 1.05} ${170 + ry * 0.9} ${560 - rx * 0.4} ${170 + ry * 1.2} ${560 - rx} 170Z`}
          fill="none"
          stroke="var(--color-on-ink-label)"
          strokeWidth="1.2"
          opacity={0.55 - ring * 0.05}
        />
      );
    })}
    <circle cx="560" cy="170" r="5" fill="var(--color-glacier)" />
  </svg>
);

/**
 * The top of a legal page (design: canvas "Everest Trek Website", Rechtliches): on ice with contour lines, the
 * breadcrumb, title, intro, "Zuletzt aktualisiert" and the reading time; at its foot the four legal pages as file tabs,
 * the open one merging into the white page below. The tabs show on every screen and scroll sideways on a phone.
 */
export const LegalHeader = ({ doc }: { doc: LegalDoc }) => {
  const isLong = doc.slug === "terms" || doc.slug === "privacy";
  return (
    <div className="relative overflow-hidden border-0 border-b border-solid border-ice-strong bg-ice">
      <Contours />
      <div className="wrap relative flex flex-col pt-7">
        <div className="print:hidden">
          <Breadcrumbs items={[{ label: "Startseite", href: ROUTES.home }, { label: "Rechtliches" }, { label: doc.title }]} />
        </div>
        <span className="eyebrow mt-9">Rechtliches</span>
        <h1 className="mt-2.5 max-w-195 text-[clamp(38px,3vw+26px,56px)]! leading-[1.07]!">{doc.title}</h1>
        {doc.intro && <p className="mt-4 max-w-170 text-lg leading-7.5">{doc.intro}</p>}
        <p className="mt-5.5 flex flex-wrap gap-2.5">
          {doc.updated && (
            <span className={CHIP}>
              <TrailIcon name="clock" size={16} className="text-ocean" />
              Zuletzt aktualisiert: {doc.updated}
            </span>
          )}
          {isLong && doc.sections.length > 0 && (
            <span className={CHIP}>
              <TrailIcon name="doc" size={16} className="text-ocean" />
              ca. {legalReadingMinutes(doc)} Min. Lesezeit · {doc.sections.length} Abschnitte
            </span>
          )}
        </p>
        <nav aria-label="Rechtliche Seiten" className="mt-10 overflow-x-auto [scrollbar-width:none] print:hidden">
          <ul className="flex gap-1">
            {LEGAL_PAGES.map((page) => {
              const isCurrent = page.slug === doc.slug;
              return (
                <li key={page.slug} className="flex-none">
                  <Link
                    href={page.path}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`-mb-px inline-flex min-h-13 items-center gap-2.5 rounded-t-2xl border border-b-0 border-solid px-5 text-[15px] no-underline ${
                      isCurrent ? "border-ice-strong bg-snow font-bold text-ink hover:text-ink" : "border-transparent font-semibold text-text hover:bg-white/70 hover:text-ink"
                    }`}
                  >
                    <TrailIcon name={page.icon} size={18} className={isCurrent ? "text-ocean" : "text-muted"} />
                    {page.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

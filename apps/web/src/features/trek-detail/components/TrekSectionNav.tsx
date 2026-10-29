import type { TrekPageSection } from "@ttn/config/trekPageSections";

import { TREK_SECTION_IDS, trekSectionLinks } from "../sections";

const LINK = "rounded-sm py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type TrekSectionNavProps = { hasReviews: boolean; order: readonly TrekPageSection[] };

/** Sticky "On this page" bar: jumps to each section and to the booking card. Scrolls sideways on phones. */
export const TrekSectionNav = ({ hasReviews, order }: TrekSectionNavProps) => (
  <nav aria-label="On this page" className="sticky top-0 z-30 border-b border-line bg-surface/97 shadow-card backdrop-blur-sm">
    <div className="mx-auto flex max-w-content items-center gap-5.5 relative overflow-x-auto px-4 py-2 text-xs font-bold tracking-[0.06em] whitespace-nowrap uppercase scrollbar-none md:px-6 [&::-webkit-scrollbar]:hidden">
      {trekSectionLinks({ hasReviews, order }).map((link) => (
        <a key={link.id} href={`#${link.id}`} className={`${LINK} text-text hover:text-brand`}>
          {link.label}
        </a>
      ))}
      <a href={`#${TREK_SECTION_IDS.book}`} className={`${LINK} ml-auto rounded-md bg-brand px-3.5 py-1.5 text-on-brand hover:bg-brand-hover`}>
        Book now
      </a>
    </div>
  </nav>
);

import Link from "next/link";

import { ClampedText } from "@/components/shared/ClampedText";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import type { HomeCompany } from "../types";

/** The founder's short story from Pages › About, folded behind "Read more", linking to the whole one. Left out until it is written. */
export const FounderStory = ({ company: { storyTeaser, founder } }: { company: HomeCompany }) =>
  storyTeaser && (
    <section aria-labelledby="founder-h" id="founder" className="flex flex-wrap items-start gap-5 rounded-[14px] bg-stone p-6">
      <span aria-hidden="true" className="relative inline-flex size-28 flex-none items-center justify-center overflow-hidden rounded-xl bg-forest-tint text-forest/40">
        {founder?.photo ? <SiteImage image={founder.photo} sizes="112px" className="object-cover" /> : <TrailIcon name="users" size={56} />}
      </span>
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
        <span className="eyebrow">Our roots</span>
        {/* A paragraph, not a heading: the page's headings are kept for the trek's own keyword. */}
        <p id="founder-h" className="font-display text-[22px] leading-7 font-semibold text-ink">
          Our story
        </p>
        <ClampedText>
          <p>{storyTeaser}</p>
        </ClampedText>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-solid border-line pt-2.5">
          {founder && (
            <p className="flex flex-col leading-5.5">
              <span className="font-semibold text-ink">{founder.name}</span>
              <span className="text-sm leading-5 text-muted">{founder.role}</span>
            </p>
          )}
          <Link href={`${ROUTES.about}#story`} className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
            Read our story
            <TrailIcon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { getAboutPage } from "@/features/about/services/aboutRepository";
import type { SiteImageSource } from "@/lib/images";
import { ABOUT_PATHS } from "@/lib/navigation";

import { CARD_TITLE, EYEBROW, PANEL, TEXT_ACTION } from "./styles";

/** The founder's photo, or a person icon until there is one, with a "verified" tick. Decorative: the name is beside it. */
const Portrait = ({ photo }: { photo?: SiteImageSource }) => (
  <span
    aria-hidden="true"
    className="relative inline-flex size-28 flex-none items-center justify-center self-center rounded-xl border-2 border-brand bg-linear-160 from-brand-tint to-[#c4ddf1] text-navy/40 shadow-[0_0_0_2px_#fff,0_4px_10px_rgba(15,23,42,0.12)]"
  >
    {photo ? (
      <span className="absolute inset-0 overflow-hidden rounded-[10px]">
        <SiteImage image={{ ...photo, alt: "" }} sizes="112px" className="object-cover" />
      </span>
    ) : (
      <Icon name="person" size={60} />
    )}
    <span className="absolute -right-1.5 -bottom-1.5 inline-flex size-7 items-center justify-center rounded-full border-2 border-white bg-whatsapp text-white">
      <Icon name="verified" size={15} />
    </span>
  </span>
);

/** "Born in the mountains of Nepal": the short founder story from Pages › About, linking to the full one. */
export const FounderStoryCard = async () => {
  const { story, founder } = await getAboutPage();
  if (!story.teaser) return null;
  return (
  <section aria-labelledby="founder-story-title" className={`${PANEL} flex flex-col gap-4 p-4.5 md:p-6`}>
    <div className="flex flex-col gap-1">
      <p className={EYEBROW}>Our heritage and roots</p>
      <h2 id="founder-story-title" className={CARD_TITLE}>
        Born in the mountains of Nepal: our story
      </h2>
    </div>

    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <Portrait photo={founder?.photo} />
      <div className="flex min-w-0 flex-1 flex-col gap-2 text-body-sm text-text">
        <p>{story.teaser}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-muted pt-2.5">
          {founder ? (
            <p className="flex flex-col leading-snug">
              <span className="font-display font-bold text-ink">{founder.name}</span>
              <span className="text-xs font-semibold text-brand">{founder.role}</span>
            </p>
          ) : (
            <span />
          )}
          <Link href={ABOUT_PATHS.story} className={TEXT_ACTION}>
            Read our story
          </Link>
        </div>
      </div>
    </div>
  </section>
  );
};

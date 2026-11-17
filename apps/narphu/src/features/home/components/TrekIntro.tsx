import type { SiteImageSource } from "@ttn/site-data/images";

import { ClampedText } from "@/components/shared/ClampedText";
import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

import type { HomeTrek, HomeTrekGuide } from "../types";

type TrekIntroProps = {
  intro: HomeTrek["intro"];
  /** One of the trek's photos, tall beside the text. */
  photo?: SiteImageSource;
  /** The first of the trek's guides with a quote: their words over the photo. */
  guide?: HomeTrekGuide;
};

/** The trek's overview (design: Home, Overview): the introduction from the trek editor, folded after eight lines, beside a photo with a guide's words on it. */
export const TrekIntro = ({ intro, photo, guide }: TrekIntroProps) => (
  <section aria-labelledby="intro-h" id="intro" className="flex flex-wrap items-center gap-14 max-md:gap-10">
    <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
      <SectionHeading id="intro-h" eyebrow="The trek" title={intro.heading} />
      <ClampedText lines={8} className="text-[18px] leading-7.5">
        <RichText doc={intro.body} className="flex flex-col gap-4" />
      </ClampedText>
    </div>
    {photo && (
      <figure className="relative m-0 min-w-0 flex-[1_1_380px] max-md:pb-24">
        <div className="relative h-150 overflow-hidden rounded-[28px] bg-maroon-tint max-md:h-90">
          <SiteImage image={photo} sizes="(min-width: 1024px) 500px, 100vw" className="object-cover" />
        </div>
        {guide && (
          <blockquote className="absolute bottom-8 -left-7 m-0 flex max-w-85 flex-col gap-2.5 rounded-[20px] border border-solid border-line bg-snow px-5.5 py-5 shadow-raised max-lg:left-4 max-md:right-4 max-md:bottom-0">
            <span aria-hidden="true" className="h-6 text-5xl leading-none font-semibold text-saffron">
              “
            </span>
            <p className="m-0 text-[17px] leading-6.5 text-ink">{guide.quote}</p>
            <footer className="text-sm leading-5">
              <strong className="font-semibold text-ink">{guide.name}</strong>
              <span className="text-muted"> · {guide.role}</span>
            </footer>
          </blockquote>
        )}
      </figure>
    )}
  </section>
);

import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeTrek } from "../types";

/** "The trek": the introduction written in the trek editor. */
export const TrekIntro = ({ intro }: { intro: HomeTrek["intro"] }) => (
  <section aria-labelledby="intro-h" id="intro" className="flex flex-col gap-3.5">
    <SectionHeading id="intro-h" eyebrow="The trek" title={intro.heading} />
    <RichText doc={intro.body} className="flex flex-col gap-4 text-lg leading-7.5" />
  </section>
);

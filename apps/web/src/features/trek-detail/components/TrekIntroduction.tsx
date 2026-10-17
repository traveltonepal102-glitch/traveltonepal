import { Icon } from "@ttn/ui/icon";

import { ReadMore } from "@/components/shared/ReadMore";

import { EYEBROW, PANEL, TEXT_ACTION } from "./styles";

/** "Introduction" card: the first paragraph, the rest behind "Read more". */
export const TrekIntroduction = ({ paragraphs }: { paragraphs: readonly string[] }) => (
  <section aria-labelledby="trek-intro-title" className={`${PANEL} flex flex-col gap-3.5 p-4.5 text-text md:p-6`}>
    <h2 id="trek-intro-title" className={`${EYEBROW} inline-flex items-center gap-2 font-sans`}>
      <Icon name="travel_explore" size={22} />
      Introduction
    </h2>
    <ReadMore paragraphs={paragraphs} buttonClassName={TEXT_ACTION} />
  </section>
);

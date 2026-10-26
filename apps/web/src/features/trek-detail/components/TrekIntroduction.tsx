import { Icon } from "@ttn/ui/icon";

import { ReadMore } from "@/components/shared/ReadMore";
import { RichTextPhoto } from "@/components/shared/RichTextPhoto";
import type { RichTextImage } from "@ttn/ui/lib/richText";

import { EYEBROW, PANEL, TEXT_ACTION } from "./styles";

/** "Introduction" card: the first paragraph, the rest behind "Read more", and the photos added in the text. */
export const TrekIntroduction = ({ paragraphs, photos }: { paragraphs: readonly string[]; photos: readonly RichTextImage[] }) => (
  <section aria-labelledby="trek-intro-title" className={`${PANEL} flex flex-col gap-3.5 p-4.5 text-text md:p-6`}>
    <h2 id="trek-intro-title" className={`${EYEBROW} inline-flex items-center gap-2 font-sans`}>
      <Icon name="travel_explore" size={22} />
      Introduction
    </h2>
    <ReadMore paragraphs={paragraphs} buttonClassName={TEXT_ACTION} />
    {photos.map((photo) => (
      <RichTextPhoto key={photo.attrs.photoId} image={photo} />
    ))}
  </section>
);

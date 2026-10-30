import { Icon } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { ReadMore } from "@/components/shared/ReadMore";
import { RichText } from "@/components/shared/RichText";

import { hasRichTextContent } from "../trekPageJson";
import { EYEBROW, PANEL, TEXT_ACTION } from "./styles";

const TEXT = "flex flex-col gap-3";

/** "Introduction" card: the text as written (photos where they were put), its first block shown until "Read more". */
export const TrekIntroduction = ({ body }: { body: RichTextDoc }) => {
  const [first, ...rest] = body.content.filter((block) => hasRichTextContent({ type: "doc", content: [block] }));

  return (
    <section aria-labelledby="trek-intro-title" className={`${PANEL} flex flex-col gap-3.5 p-4.5 text-text md:p-6`}>
      <h2 id="trek-intro-title" className={`${EYEBROW} inline-flex items-center gap-2 font-sans`}>
        <Icon name="travel_explore" size={22} />
        Introduction
      </h2>
      <ReadMore buttonClassName={TEXT_ACTION} more={rest.length > 0 && <RichText doc={{ type: "doc", content: rest }} className={TEXT} />}>
        {first && <RichText doc={{ type: "doc", content: [first] }} className={TEXT} />}
      </ReadMore>
    </section>
  );
};

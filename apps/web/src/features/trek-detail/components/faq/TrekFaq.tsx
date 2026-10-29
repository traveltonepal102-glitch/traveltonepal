import { Icon } from "@ttn/ui/icon";

import { RichTextPhoto } from "@/components/shared/RichTextPhoto";

import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { FaqGroupCard } from "./FaqGroupCard";

/** "Itinerary and duration" → "faq-itinerary-and-duration" */
const groupAnchor = (title: string) => `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

type TrekFaqProps = Pick<TrekDetail, "name" | "faqs">;

/** FAQ: topic links (sticky on desktop, a sideways row on phones) and the questions by topic. */
export const TrekFaq = ({ name, faqs }: TrekFaqProps) => {
  if (faqs.length === 0) return null;

  return (
    <section id={TREK_SECTION_IDS.faq} aria-labelledby="trek-faq-title" className="scroll-mt-12 border-t border-line bg-page py-10">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-8 w-1.5 flex-none rounded-full bg-brand" />
          <h2 id="trek-faq-title" className="text-[24px] leading-tight font-extrabold tracking-tight md:text-[32px]">
            Frequently asked questions for the {name}
          </h2>
        </div>

        {/* grid-cols-1 (minmax(0, 1fr)) keeps the scrolling topic row from widening the column on phones. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
          <nav aria-label="FAQ topics" className="rounded-xl border border-line bg-surface p-3.5 shadow-card lg:sticky lg:top-16">
            <ul className="flex gap-1 relative overflow-x-auto lg:flex-col">
              {faqs.map((group) => (
                <li key={group.title} className="flex-none">
                  <a
                    href={`#${groupAnchor(group.title)}`}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-body-sm font-medium whitespace-nowrap text-text hover:bg-brand-tint hover:text-brand focus-visible:outline-2 focus-visible:outline-ring lg:whitespace-normal"
                  >
                    <Icon name={group.icon} className="flex-none text-subtle" />
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-6">
            {faqs.map((group, index) => (
              <FaqGroupCard
                key={group.title}
                group={group}
                id={groupAnchor(group.title)}
                isFirstOpen={index === 0}
                answerPhotos={group.items.map((item) => item.photos.map((photo) => <RichTextPhoto key={photo.attrs.photoId} image={photo} />))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

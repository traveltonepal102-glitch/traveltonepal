"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import type { Photo } from "@/features/photos/types";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import { MAX_KNOW_TOPICS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { KnowTopic, TrekValues } from "../../../types";
import { PageHeadingFields } from "../PageHeadingFields";
import { KnowTopicCard } from "./KnowTopicCard";

type KnowSectionProps = {
  values: TrekValues;
  /** The photos the topics may already show (the trek's and the topics' own), for the previews. */
  photos: Photo[];
  /** The saved trek's id: the photo window shows this trek's photos first (null for a new trek). */
  trekId: string | null;
  errors: FieldErrors;
  onEdit: () => void;
};

const NEW_TOPIC: KnowTopic = { icon: "wb_twilight", title: "", body: EMPTY_RICH_TEXT, note: "", photoId: null, videoId: null };

/**
 * "Trek guide: season, facilities and safety" (the page's "Practical field knowledge"): heading, line and topics,
 * usually best season, accommodation, food and water, and emergencies. Each can show a photo or a video.
 */
export const KnowSection = ({ values, photos, trekId, errors, onEdit }: KnowSectionProps) => {
  const list = useRowList<KnowTopic>(values.knowTopics, onEdit);
  const guideVideos = values.videos.filter((video) => video.inGuide);

  return (
    <>
      <PageHeadingFields
        eyebrow="Practical field knowledge"
        level="H2"
        heading={{ name: "knowHeading", defaultValue: values.knowHeading, placeholder: "Langtang Valley Trek guide: best season, facilities and high-altitude safety", error: errors.knowHeading }}
        line={{ name: "knowIntro", defaultValue: values.knowIntro, placeholder: "Essential insights from our local trek leaders.", maxLength: LIMIT.knowIntro, error: errors.knowIntro }}
      />
      <FormSection
        title="Topics"
        hint="Usually 4: best season, accommodation, food and water, and emergencies. Each topic can show a photo from the photo library (this trek’s photos first) or a YouTube video: paste any link, or pick a video ticked for “Trek guide topics” in Photo gallery and videos."
      >
        {list.rows.map((topic, index) => (
          <KnowTopicCard
            key={topic.key}
            topic={topic}
            index={index}
            photos={photos}
            trekId={trekId}
            videos={guideVideos}
            errors={errors}
            onMoveUp={index > 0 ? () => list.move(index, index - 1) : undefined}
            onRemove={() => list.remove(topic.key)}
            onEdit={onEdit}
          />
        ))}
        {!list.rows.length && <p className="m-0 text-caption text-muted-foreground">No topics yet: the trek page leaves this section out.</p>}
        <button type="button" onClick={() => list.add(NEW_TOPIC)} disabled={list.rows.length >= MAX_KNOW_TOPICS} className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}>
          <Icon name="add" size={16} />
          Add topic
        </button>
        <FieldError id="know-topics-error" message={errors.knowTopics} />
      </FormSection>
    </>
  );
};

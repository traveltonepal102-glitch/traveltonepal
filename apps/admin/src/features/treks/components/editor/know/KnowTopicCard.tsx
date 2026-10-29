"use client";

import { Icon } from "@ttn/ui/icon";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { KNOW_ICONS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { KnowTopic, TrekVideo } from "../../../types";
import { TopicMediaField } from "./TopicMediaField";

type KnowTopicCardProps = {
  topic: KnowTopic;
  index: number;
  /** The trek's photos (cover first) and videos, to show one with the topic. */
  photos: Photo[];
  videos: TrekVideo[];
  errors: FieldErrors;
  onMoveUp?: () => void;
  onRemove: () => void;
  onEdit: () => void;
};

/**
 * One topic of the trek guide: icon, heading (H3), its text (paragraphs, lists or bold lead-ins like
 * "Rooms: simple twin rooms…"), an optional smaller note, and an optional photo or video. Sent as
 * knowIcon / knowTitle / knowBody / knowNote / knowMedia.
 */
export const KnowTopicCard = ({ topic, index, photos, videos, errors, onMoveUp, onRemove, onEdit }: KnowTopicCardProps) => {
  const number = index + 1;
  const field = `knowTopics.${index}`;
  const media = topic.photoId ? `photo:${topic.photoId}` : topic.videoId ? `video:${topic.videoId}` : "";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-solid border-border bg-page p-3">
      <div className="grid items-start gap-2 tablet:grid-cols-[150px_minmax(0,1fr)_auto]">
        <SelectField name="knowIcon" label={`Icon, topic ${number}`} options={KNOW_ICONS} defaultValue={topic.icon} error={errors[`${field}.icon`]} />
        <TextField
          name="knowTitle"
          label={`Topic ${number} heading`}
          labelNote="H3"
          defaultValue={topic.title}
          placeholder="Best season and weather windows"
          maxLength={LIMIT.heading}
          error={errors[`${field}.title`]}
          inputClassName="font-bold"
        />
        <span className="flex gap-0.5 tablet:pt-6">
          <button type="button" className={ghostIconButton} aria-label={`Move topic ${number} up`} disabled={!onMoveUp} onClick={onMoveUp}>
            <Icon name="arrow_upward" size={18} />
          </button>
          <button type="button" className={ghostIconButton} aria-label={`Remove topic ${number}`} onClick={onRemove}>
            <Icon name="delete" size={18} />
          </button>
        </span>
      </div>
      <RichTextEditor
        name="knowBody"
        label="Text"
        hint="Write it your way: paragraphs, a list, or short points that start with a bold lead-in (“Rooms: simple twin rooms…”)."
        defaultValue={topic.body}
        maxLength={LIMIT.knowText}
        error={errors[`${field}.body`]}
        onEdit={onEdit}
      />
      <div className="grid items-start gap-3 desktop:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TextField
          name="knowNote"
          label="Smaller note after the text"
          labelNote="(optional)"
          defaultValue={topic.note}
          placeholder="Winter (Dec–Feb) is clear but very cold at Kyanjin."
          maxLength={LIMIT.knowNote}
          error={errors[`${field}.note`]}
        />
        <TopicMediaField
          defaultValue={media}
          topicLabel={`topic ${number}`}
          photos={photos}
          videos={videos}
          errorId={`know-topic-${index}-media-error`}
          error={errors[`${field}.media`]}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
};

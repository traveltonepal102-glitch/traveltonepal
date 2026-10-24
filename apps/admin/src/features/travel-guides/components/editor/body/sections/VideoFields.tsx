import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

import { TextField } from "@/components/ui/TextField";
import { youtubeIdFrom, youtubeThumbnail } from "@/features/treks/lib/youtube";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type VideoFieldsProps = {
  /** The pasted link (or the saved video id); only the id is saved. */
  youtubeId: string;
  title: string;
  /** e.g. "sections.9" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { youtubeId?: string; title?: string }) => void;
};

/** "YouTube video": plays only after the visitor clicks Play on the website (privacy rules). */
export const VideoFields = ({ youtubeId, title, field, errors, onChange }: VideoFieldsProps) => {
  const id = youtubeIdFrom(youtubeId);
  return (
    <div className="grid items-start gap-3 tablet:grid-cols-[200px_minmax(0,1fr)]">
      <span className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-navy text-white/50">
        {/* YouTube's own small picture, shown as it is (nothing is uploaded or resized). */}
        {id ? <Image src={youtubeThumbnail(id)} alt="" width={320} height={180} unoptimized className="h-full w-full object-cover" /> : <Icon name="smart_display" size={36} />}
      </span>
      <div className="flex flex-col gap-3">
        <TextField
          name="sectionVideoLink"
          label="YouTube link"
          value={youtubeId}
          onValueChange={(next) => onChange({ youtubeId: next })}
          placeholder="https://www.youtube.com/watch?v=…"
          error={errors[`${field}.youtubeId`]}
        />
        <TextField name="sectionVideoTitle" label="Title" value={title} onValueChange={(next) => onChange({ title: next })} placeholder="Walking to Kyanjin Ri" maxLength={LIMIT.videoTitle} error={errors[`${field}.title`]} />
      </div>
    </div>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { LibraryVideoDialog } from "@/features/videos/components/LibraryVideoDialog";
import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";
import { youtubeIdFrom } from "@/features/videos/lib/youtube";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type VideoFieldsProps = {
  /** The chosen library video's YouTube id ("" for none yet). */
  youtubeId: string;
  title: string;
  /** e.g. "sections.9" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { youtubeId?: string; title?: string }) => void;
};

/** "YouTube video": a video from the video library; plays only after the visitor clicks Play on the website (privacy rules). */
export const VideoFields = ({ youtubeId, title, field, errors, onChange }: VideoFieldsProps) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const id = youtubeIdFrom(youtubeId);

  return (
    <div className="grid items-start gap-3 tablet:grid-cols-[200px_minmax(0,1fr)]">
      <VideoThumbnail youtubeId={id} className="rounded-md" />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <button type="button" onClick={() => setIsChoosing(true)} className={cn(secondaryButton, "self-start")}>
            <Icon name={id ? "edit" : "add"} size={18} />
            {id ? "Choose another video" : "Choose a video"}
          </button>
          <FieldError id={`${field}-video-error`} message={errors[`${field}.youtubeId`]} />
        </div>
        <TextField
          name="sectionVideoTitle"
          label="Title"
          value={title}
          onValueChange={(next) => onChange({ title: next })}
          placeholder="Walking to Kyanjin Ri"
          hint="Shown with the video in this guide. Choosing a video fills it in when empty."
          maxLength={LIMIT.videoTitle}
          error={errors[`${field}.title`]}
        />
      </div>
      {isChoosing && (
        <LibraryVideoDialog
          title="Video for this section"
          selectedIds={id ? [id] : []}
          onChoose={(video) => onChange({ youtubeId: video.youtubeId, title: title.trim() ? title : video.title })}
          onClose={() => setIsChoosing(false)}
        />
      )}
    </div>
  );
};

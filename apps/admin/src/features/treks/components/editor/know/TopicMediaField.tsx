"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Image from "next/image";
import { useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

import { youtubeThumbnail } from "../../../lib/youtube";
import type { TrekVideo } from "../../../types";
import { TopicMediaDialog } from "./TopicMediaDialog";

type TopicMediaFieldProps = {
  /** The saved choice: "photo:<id>", "video:<youtube id>" or "". */
  defaultValue: string;
  /** e.g. "topic 2". */
  topicLabel: string;
  photos: Photo[];
  videos: TrekVideo[];
  /** e.g. "knowTopics.1.media". */
  errorId: string;
  error?: string;
  onEdit: () => void;
};

/**
 * A topic's photo or video: a small preview of the choice, and a window to choose or change it. Sent as
 * knowMedia ("photo:<id>", "video:<youtube id>" or "" for none), as the form expects.
 */
export const TopicMediaField = ({ defaultValue, topicLabel, photos, videos, errorId, error, onEdit }: TopicMediaFieldProps) => {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const photo = value.startsWith("photo:") ? photos.find((item) => item.id === value.slice(6)) : undefined;
  const videoId = value.startsWith("video:") ? value.slice(6) : null;
  const video = videoId ? videos.find((item) => item.youtubeId === videoId) : undefined;
  const change = (next: string) => {
    if (next === value) return;
    setValue(next);
    onEdit();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">
        Photo or video <span className="font-normal text-muted-foreground">(optional)</span>
      </span>
      <input type="hidden" name="knowMedia" value={value} />
      <div className="flex items-center gap-3 rounded-lg border border-solid border-border bg-surface p-2">
        <span className="flex aspect-4/3 w-24 flex-none items-center justify-center overflow-hidden rounded-md bg-navy text-white/50">
          {photo && <PhotoImage photo={photo} alt="" sizes="96px" className="block h-full w-full object-cover" />}
          {videoId && <Image src={youtubeThumbnail(videoId)} alt="" width={160} height={90} unoptimized className="block h-full w-full object-cover" />}
          {!photo && !videoId && <Icon name={value ? "error" : "add_photo_alternate"} size={26} />}
        </span>
        <span className="min-w-0 flex-1 text-caption text-text">
          {photo && <>Photo{photo.place ? ` · ${photo.place}` : ""}</>}
          {videoId && <>YouTube video{video ? ` · ${video.title}` : ""}</>}
          {!photo && !videoId && (value ? "The chosen photo is no longer in this trek’s photos." : "None. The topic shows its text only.")}
        </span>
        <button type="button" onClick={() => setIsOpen(true)} className={cn(secondaryButton, "min-h-8 flex-none px-3 text-caption")}>
          <Icon name={value ? "edit" : "add"} size={16} />
          {value ? "Change" : "Choose photo or video"}
        </button>
        {value && (
          <button type="button" aria-label={`Remove the photo or video of ${topicLabel}`} onClick={() => change("")} className={ghostIconButton}>
            <Icon name="close" size={18} />
          </button>
        )}
      </div>
      <FieldError id={errorId} message={error} />
      {isOpen && <TopicMediaDialog topicLabel={topicLabel} value={value} photos={photos} videos={videos} onChoose={change} onClose={() => setIsOpen(false)} />}
    </div>
  );
};

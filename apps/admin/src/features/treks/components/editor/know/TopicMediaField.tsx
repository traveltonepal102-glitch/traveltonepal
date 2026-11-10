"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Image from "next/image";
import { useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { EditPhotoTextButton } from "@/features/photos/components/EditPhotoTextButton";
import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

import { youtubeThumbnail } from "@/features/videos/lib/youtube";
import type { TrekVideo } from "../../../types";
import { TopicMediaDialog } from "./TopicMediaDialog";

type TopicMediaFieldProps = {
  /** The saved choice: "photo:<id>", "video:<youtube id>" or "". */
  defaultValue: string;
  /** e.g. "topic 2". */
  topicLabel: string;
  /** The photos the topics may already show, to preview the saved choice. */
  photos: Photo[];
  /** The saved trek's id: the photo window shows this trek's photos first (null for a new trek). */
  trekId: string | null;
  videos: TrekVideo[];
  /** e.g. "knowTopics.1.media". */
  errorId: string;
  error?: string;
  onEdit: () => void;
};

const smallButton = cn(secondaryButton, "min-h-8 flex-none px-3 text-caption");

/**
 * A topic's photo (from the photo library) or video: a small preview of the choice, and a window to choose each.
 * Sent as knowMedia ("photo:<id>", "video:<youtube id>" or "" for none), as the form expects.
 */
export const TopicMediaField = ({ defaultValue, topicLabel, photos, trekId, videos, errorId, error, onEdit }: TopicMediaFieldProps) => {
  const [value, setValue] = useState(defaultValue);
  const [chosenPhoto, setChosenPhoto] = useState<Photo | null>(null);
  const [openWindow, setOpenWindow] = useState<"photo" | "video" | null>(null);
  const photoId = value.startsWith("photo:") ? value.slice(6) : null;
  const photo = photoId ? [chosenPhoto, ...photos].find((item) => item?.id === photoId) : undefined;
  const videoId = value.startsWith("video:") ? value.slice(6) : null;
  const video = videoId ? videos.find((item) => item.youtubeId === videoId) : undefined;
  const change = (next: string) => {
    if (next === value) return;
    setValue(next);
    onEdit();
  };
  const choosePhoto = (next: Photo) => {
    setChosenPhoto(next);
    change(`photo:${next.id}`);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">
        Photo or video <span className="font-normal text-muted-foreground">(optional)</span>
      </span>
      <input type="hidden" name="knowMedia" value={value} />
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-solid border-border bg-surface p-2">
        <span className="flex aspect-4/3 w-24 flex-none items-center justify-center overflow-hidden rounded-md bg-navy text-white/50">
          {photo && <PhotoImage photo={photo} alt="" sizes="96px" className="block h-full w-full object-cover" />}
          {videoId && <Image src={youtubeThumbnail(videoId)} alt="" width={160} height={90} unoptimized className="block h-full w-full object-cover" />}
          {!photo && !videoId && <Icon name={value ? "error" : "add_photo_alternate"} size={26} />}
        </span>
        <span className="min-w-0 flex-1 text-caption text-text">
          {photo && <>Photo{photo.place ? ` · ${photo.place}` : ""}</>}
          {videoId && <>YouTube video{video ? ` · ${video.title}` : ""}</>}
          {!photo && !videoId && (value ? "The chosen photo is no longer in the library. Choose another." : "None. The topic shows its text only.")}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setOpenWindow("photo")} className={smallButton}>
            <Icon name="image" size={16} />
            {photoId ? "Change photo" : "Choose photo"}
          </button>
          <button type="button" onClick={() => setOpenWindow("video")} className={smallButton}>
            <Icon name="smart_display" size={16} />
            {videoId ? "Change video" : "Choose video"}
          </button>
          {photo && <EditPhotoTextButton photo={photo} variant="icon" />}
          {value && (
            <button type="button" aria-label={`Remove the photo or video of ${topicLabel}`} onClick={() => change("")} className={ghostIconButton}>
              <Icon name="close" size={18} />
            </button>
          )}
        </span>
      </div>
      <FieldError id={errorId} message={error} />
      {openWindow === "photo" && (
        <LibraryPhotoDialog
          title={`Photo for ${topicLabel}`}
          size="landscape"
          selected={photo ? [photo] : []}
          pick={{ kind: "one", onChoose: choosePhoto }}
          trekId={trekId}
          startWithTrekPhotos
          onClose={() => setOpenWindow(null)}
        />
      )}
      {openWindow === "video" && <TopicMediaDialog topicLabel={topicLabel} value={value} videos={videos} onChoose={change} onClose={() => setOpenWindow(null)} />}
    </div>
  );
};

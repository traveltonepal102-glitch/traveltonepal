"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useState } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { LibraryVideoDialog } from "@/features/videos/components/LibraryVideoDialog";
import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";
import { VIDEOS_PATH } from "@/features/videos/constants";
import { youtubeWatchUrl } from "@/features/videos/lib/youtube";
import type { LibraryVideo } from "@/features/videos/types";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_VIDEOS } from "../../../constants";
import type { TrekVideo } from "../../../types";

type VideosCardProps = {
  videos: TrekVideo[];
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "YouTube videos" (design): videos chosen from the video library (Photos and videos), each with where it shows.
 * The trek saves only the video's id; its title comes from the library. Sent as videoId / videoInGallery /
 * videoInGuide, one of each per video.
 */
export const VideosCard = ({ videos, errors, onEdit }: VideosCardProps) => {
  const list = useRowList<TrekVideo>(videos, onEdit);
  const [isChoosing, setIsChoosing] = useState(false);
  const isFull = list.rows.length >= MAX_VIDEOS;

  const addVideo = (video: LibraryVideo) => {
    if (list.rows.some((row) => row.youtubeId === video.youtubeId)) return;
    list.add({ youtubeId: video.youtubeId, title: video.title, inGallery: true, inGuide: false });
  };

  return (
    <FormSection
      title="YouTube videos"
      hint="Choose videos from the video library, or add a new YouTube link there. Videos play only after the visitor clicks Play (privacy rules). Only the link is saved, so videos don't slow down the site."
      aside={<span className="rounded-full bg-page px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-muted-foreground">{list.rows.length} videos</span>}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setIsChoosing(true)} disabled={isFull} className={secondaryButton}>
          <Icon name="add" size={18} />
          Add a video
        </button>
        <span className="text-caption text-muted-foreground">
          {isFull ? `Up to ${MAX_VIDEOS} videos. ` : ""}Titles are changed in{" "}
          <Link href={VIDEOS_PATH} className="font-semibold text-brand">
            Photos and videos
          </Link>
          .
        </span>
      </div>

      {list.rows.map((row, index) => (
        <div key={row.key} className="grid items-start gap-3 rounded-xl border border-solid border-border bg-page p-3 tablet:grid-cols-[160px_minmax(0,1fr)_auto]">
          <input type="hidden" name="videoId" value={row.youtubeId} />
          <input type="hidden" name="videoInGallery" value={String(row.inGallery)} />
          <input type="hidden" name="videoInGuide" value={String(row.inGuide)} />
          <a href={youtubeWatchUrl(row.youtubeId)} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-md">
            <VideoThumbnail youtubeId={row.youtubeId} hasPlayIcon />
            <span className="sr-only">Watch on YouTube (opens a new tab)</span>
          </a>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="m-0 text-body-sm font-bold text-ink">{row.title || "This video is no longer in the library"}</p>
            <fieldset className="m-0 flex flex-wrap items-center gap-3 border-0 p-0 text-caption">
              <legend className="float-left mr-1 p-0 font-bold text-ink">Show in:</legend>
              <label className="inline-flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={row.inGallery} onChange={(event) => list.update(row.key, { inGallery: event.target.checked })} className="size-4 accent-brand" />
                Photo gallery
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5">
                <input type="checkbox" checked={row.inGuide} onChange={(event) => list.update(row.key, { inGuide: event.target.checked })} className="size-4 accent-brand" />
                Trek guide topics
              </label>
            </fieldset>
            <FieldError id={`videos-${index}-error`} message={errors[`videos.${index}.youtubeId`]} />
          </div>
          <span className="flex gap-0.5">
            <button type="button" className={ghostIconButton} aria-label={`Move video ${index + 1} up`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
              <Icon name="arrow_upward" size={18} />
            </button>
            <button type="button" className={ghostIconButton} aria-label={`Remove video ${index + 1}`} onClick={() => list.remove(row.key)}>
              <Icon name="delete" size={18} />
            </button>
          </span>
        </div>
      ))}
      <FieldError id="videos-error" message={errors.videos} />
      {isChoosing && (
        <LibraryVideoDialog title="Add a video to this trek" selectedIds={list.rows.map((row) => row.youtubeId)} onChoose={addVideo} onClose={() => setIsChoosing(false)} />
      )}
    </FormSection>
  );
};

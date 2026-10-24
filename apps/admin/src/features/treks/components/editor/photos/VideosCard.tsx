"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Image from "next/image";
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass } from "@/components/ui/formStyles";
import { TextField } from "@/components/ui/TextField";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_VIDEOS, TREK_LIMITS as LIMIT } from "../../../constants";
import { youtubeIdFrom, youtubeThumbnail, youtubeWatchUrl } from "../../../lib/youtube";
import type { TrekVideo } from "../../../types";

type VideosCardProps = {
  videos: TrekVideo[];
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "YouTube videos" (design): paste a link, give it a title, choose where it shows. Only the video's id is saved;
 * the trek page plays it only after the visitor clicks Play (privacy rules). Sent as videoId / videoTitle /
 * videoInGallery / videoInGuide, one of each per video.
 */
export const VideosCard = ({ videos, errors, onEdit }: VideosCardProps) => {
  const id = useId();
  const list = useRowList<TrekVideo>(videos, onEdit);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const isFull = list.rows.length >= MAX_VIDEOS;

  const add = () => {
    const youtubeId = youtubeIdFrom(link);
    if (!youtubeId) return setLinkError("Paste a YouTube video link, e.g. https://www.youtube.com/watch?v=…");
    if (list.rows.some((row) => row.youtubeId === youtubeId)) return setLinkError("This video is already on the trek.");
    list.add({ youtubeId, title: "", inGallery: true, inGuide: false });
    setLink("");
    setLinkError("");
  };
  // Enter adds the video instead of saving the whole form.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    add();
  };

  return (
    <FormSection
      title="YouTube videos"
      hint="Paste a YouTube link and give it a title. Videos play only after the visitor clicks Play (privacy rules). Only the link is saved, so videos don't slow down the site."
      aside={<span className="rounded-full bg-page px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-muted-foreground">{list.rows.length} videos</span>}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-link`} className="sr-only">
          YouTube link
        </label>
        <div className="flex gap-2">
          <input
            id={`${id}-link`}
            value={link}
            onChange={(event) => setLink(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isFull}
            placeholder="Paste a YouTube link, e.g. https://www.youtube.com/watch?v=…"
            aria-describedby={linkError ? `${id}-link-error` : undefined}
            className={inputClass}
          />
          <button type="button" onClick={add} disabled={isFull || !link.trim()} className={cn(secondaryButton, "flex-none")}>
            <Icon name="add" size={18} />
            Add video
          </button>
        </div>
        <FieldError id={`${id}-link-error`} message={linkError} />
      </div>

      {list.rows.map((row, index) => (
        <div key={row.key} className="grid items-start gap-3 rounded-xl border border-solid border-border bg-page p-3 tablet:grid-cols-[160px_minmax(0,1fr)_auto]">
          <input type="hidden" name="videoId" value={row.youtubeId} />
          <input type="hidden" name="videoInGallery" value={String(row.inGallery)} />
          <input type="hidden" name="videoInGuide" value={String(row.inGuide)} />
          <a href={youtubeWatchUrl(row.youtubeId)} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden rounded-md bg-navy">
            {/* YouTube's own small picture, shown as it is (nothing is uploaded or resized). */}
            <Image src={youtubeThumbnail(row.youtubeId)} alt="" width={320} height={180} unoptimized className="block aspect-video h-auto w-full object-cover" />
            <Icon name="play_circle" size={34} className="absolute inset-0 m-auto text-white drop-shadow" />
            <span className="sr-only">Watch on YouTube (opens a new tab)</span>
          </a>
          <div className="flex min-w-0 flex-col gap-2">
            <TextField
              name="videoTitle"
              label="Title on the trek page"
              defaultValue={row.title}
              placeholder="Walking from Langtang Village to Kyanjin Gompa"
              maxLength={LIMIT.videoTitle}
              error={errors[`videos.${index}.title`] ?? errors[`videos.${index}.youtubeId`]}
            />
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
    </FormSection>
  );
};

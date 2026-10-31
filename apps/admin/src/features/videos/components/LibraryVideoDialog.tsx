"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { iconButton } from "@/components/ui/buttonStyles";
import { inputClass } from "@/components/ui/formStyles";

import { usePickerVideos } from "../hooks/usePickerVideos";
import type { LibraryVideo } from "../types";
import { NewVideoFields } from "./NewVideoFields";
import { VideoThumbnail } from "./VideoThumbnail";

type LibraryVideoDialogProps = {
  /** e.g. "Add a video to this trek". */
  title: string;
  /** YouTube ids already chosen (marked in the list). */
  selectedIds: readonly string[];
  onChoose: (video: LibraryVideo) => void;
  onClose: () => void;
};

const TILE =
  "m-0 cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 text-left aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring";

/**
 * "Choose a video" in a window: any video from the library (newest first, searchable by title), or a new YouTube
 * link (it goes to the library and is chosen). Only the choice goes back to the form.
 */
export const LibraryVideoDialog = ({ title, selectedIds, onChoose, onClose }: LibraryVideoDialogProps) => {
  const { videos, loadError, add } = usePickerVideos();
  const [search, setSearch] = useState("");
  const choose = (video: LibraryVideo) => {
    onChoose(video);
    onClose();
  };
  const query = search.trim().toLowerCase();
  const shown = videos?.filter((video) => !query || video.title.toLowerCase().includes(query)) ?? null;

  return (
    <Dialog.Root open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-95 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-95 flex max-h-[min(720px,calc(100vh-24px))] w-[min(760px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
          <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-5 py-4">
            <div className="min-w-0">
              <p className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">Video library</p>
              <Dialog.Title className="m-0 font-display text-h4 text-ink">{title}</Dialog.Title>
              <Dialog.Description className="m-0 text-caption text-muted-foreground">Click a video to use it, or add a new YouTube link.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className={iconButton}>
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <details className="border-b border-solid border-border bg-page px-5 py-3" open={videos?.length === 0}>
              <summary className="cursor-pointer text-body-sm font-bold text-ink">Add a new video to the library</summary>
              <div className="pt-3">
                <NewVideoFields
                  onAdded={(video) => {
                    add(video);
                    choose(video);
                  }}
                />
              </div>
            </details>

            <div className="flex flex-col gap-3 p-5">
              {videos && videos.length > 0 && (
                <input
                  type="search"
                  aria-label="Search the videos by title"
                  placeholder="Search by title"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className={inputClass}
                />
              )}
              {loadError ? (
                <p className="m-0 text-body-sm text-danger">The video library couldn’t be loaded. Close this window and try again, or add a new video above.</p>
              ) : !shown ? (
                <p className="m-0 text-body-sm text-muted-foreground">Loading videos…</p>
              ) : shown.length ? (
                <div className="grid grid-cols-3 gap-2.5 max-tablet:grid-cols-2">
                  {shown.map((video) => (
                    <button key={video.id} type="button" aria-pressed={selectedIds.includes(video.youtubeId)} onClick={() => choose(video)} className={TILE}>
                      <VideoThumbnail youtubeId={video.youtubeId} />
                      <span className="block truncate bg-surface px-2 py-1 text-[11px] font-semibold text-text">{video.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-body-sm text-muted-foreground">{videos?.length ? "No video has that in its title." : "The library has no videos yet. Add one above."}</p>
              )}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

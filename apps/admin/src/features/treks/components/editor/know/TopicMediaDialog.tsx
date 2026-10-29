"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Tabs } from "@base-ui/react/tabs";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Image from "next/image";
import { useState } from "react";

import { iconButton, primaryButton } from "@/components/ui/buttonStyles";
import { TextField } from "@/components/ui/TextField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

import { youtubeIdFrom, youtubeThumbnail } from "../../../lib/youtube";
import type { TrekVideo } from "../../../types";

type TopicMediaDialogProps = {
  /** e.g. "topic 2", in the title. */
  topicLabel: string;
  /** The current choice: "photo:<id>", "video:<youtube id>" or "". */
  value: string;
  photos: Photo[];
  videos: TrekVideo[];
  onChoose: (value: string) => void;
  onClose: () => void;
};

const TAB =
  "m-0 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-solid border-transparent bg-transparent px-3 py-1.5 font-sans text-body-sm font-semibold text-text hover:text-brand data-active:border-brand data-active:bg-surface data-active:text-brand";
const TILE =
  "m-0 cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 text-left aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring";

/** YouTube's own small picture, shown as it is (nothing is uploaded or resized). */
const VideoPicture = ({ youtubeId, className }: { youtubeId: string; className?: string }) => (
  <Image src={youtubeThumbnail(youtubeId)} alt="" width={320} height={180} unoptimized className={cn("block aspect-video h-auto w-full object-cover", className)} />
);

/**
 * "Photo or video" for a trek guide topic, in a window: a photo from the trek's photos (click to choose), or a
 * YouTube video (paste any YouTube link, or pick one of the trek's videos). Only the choice goes back to the form.
 */
export const TopicMediaDialog = ({ topicLabel, value, photos, videos, onChoose, onClose }: TopicMediaDialogProps) => {
  const [link, setLink] = useState(value.startsWith("video:") ? value.slice(6) : "");
  const linkedId = link.trim() ? youtubeIdFrom(link) : null;
  const choose = (next: string) => {
    onChoose(next);
    onClose();
  };

  return (
    <Dialog.Root open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-95 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-95 flex max-h-[min(680px,calc(100vh-24px))] w-[min(720px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
          <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-5 py-4">
            <div className="min-w-0">
              <p className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">Trek guide topic</p>
              <Dialog.Title className="m-0 font-display text-h4 text-ink">Photo or video for {topicLabel}</Dialog.Title>
              <Dialog.Description className="m-0 text-caption text-muted-foreground">It shows beside the topic’s text on the trek page.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className={iconButton}>
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          <Tabs.Root defaultValue={value.startsWith("video:") ? "video" : "photo"} className="flex min-h-0 flex-1 flex-col">
            <Tabs.List className="flex gap-1 border-b border-solid border-border bg-page px-5 py-2">
              <Tabs.Tab value="photo" className={TAB}>
                <Icon name="image" size={18} />
                Photo
              </Tabs.Tab>
              <Tabs.Tab value="video" className={TAB}>
                <Icon name="smart_display" size={18} />
                YouTube video
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="photo" className="min-h-0 flex-1 overflow-y-auto p-5 outline-none">
              {photos.length ? (
                <div className="grid grid-cols-3 gap-2.5 max-tablet:grid-cols-2">
                  {photos.map((photo, index) => (
                    <button key={photo.id} type="button" aria-pressed={value === `photo:${photo.id}`} onClick={() => choose(`photo:${photo.id}`)} className={TILE}>
                      <PhotoImage photo={photo} alt="" sizes="220px" className="block aspect-4/3 h-auto w-full object-cover" />
                      <span className="block truncate bg-surface px-2 py-1 text-[11px] font-semibold text-text">
                        {index === 0 ? "Cover · " : ""}
                        {photo.place || `Photo ${index + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="m-0 text-body-sm text-muted-foreground">This trek has no photos yet. Add them under “Photo gallery and videos”, then come back here.</p>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="video" className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 outline-none">
              <div className="grid items-start gap-3 tablet:grid-cols-[minmax(0,1fr)_200px]">
                <div className="flex flex-col gap-2">
                  <TextField name="topicVideoLink" label="YouTube link" value={link} onValueChange={setLink} placeholder="https://www.youtube.com/watch?v=…" />
                  {link.trim() && (
                    <p className={cn("m-0 inline-flex items-center gap-1 text-caption font-semibold", linkedId ? "text-whatsapp" : "text-danger")}>
                      <Icon name={linkedId ? "check_circle" : "error"} size={16} />
                      {linkedId ? "Video found." : "That isn’t a YouTube video link."}
                    </p>
                  )}
                  <button type="button" disabled={!linkedId} onClick={() => linkedId && choose(`video:${linkedId}`)} className={cn(primaryButton, "min-h-9 self-start px-4 text-caption")}>
                    Use this video
                  </button>
                </div>
                <span className="flex aspect-video items-center justify-center overflow-hidden rounded-md bg-navy text-white/50">
                  {linkedId ? <VideoPicture youtubeId={linkedId} /> : <Icon name="smart_display" size={36} />}
                </span>
              </div>

              {videos.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">This trek’s videos</span>
                  <div className="grid grid-cols-3 gap-2.5 max-tablet:grid-cols-2">
                    {videos.map((video) => (
                      <button key={video.youtubeId} type="button" aria-pressed={value === `video:${video.youtubeId}`} onClick={() => choose(`video:${video.youtubeId}`)} className={TILE}>
                        <VideoPicture youtubeId={video.youtubeId} />
                        <span className="block truncate bg-surface px-2 py-1 text-[11px] font-semibold text-text">{video.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Tabs.Panel>
          </Tabs.Root>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";

import { iconButton } from "@/components/ui/buttonStyles";
import { VideoThumbnail } from "@/features/videos/components/VideoThumbnail";

import type { TrekVideo } from "../../../types";

type TopicMediaDialogProps = {
  /** e.g. "topic 2", in the title. */
  topicLabel: string;
  /** The current choice: "photo:<id>", "video:<youtube id>" or "". */
  value: string;
  videos: TrekVideo[];
  onChoose: (value: string) => void;
  onClose: () => void;
};

const TILE =
  "m-0 cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 text-left aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring";

/**
 * A YouTube video for a trek guide topic, in a window: one of the trek's videos (from the video library), click to
 * choose. Only the choice goes back to the form. (Its photo is chosen in the photo library window.)
 */
export const TopicMediaDialog = ({ topicLabel, value, videos, onChoose, onClose }: TopicMediaDialogProps) => {
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
              <Dialog.Title className="m-0 font-display text-h4 text-ink">Video for {topicLabel}</Dialog.Title>
              <Dialog.Description className="m-0 text-caption text-muted-foreground">It shows beside the topic’s text on the trek page.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className={iconButton}>
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {videos.length ? (
              <div className="grid grid-cols-3 gap-2.5 max-tablet:grid-cols-2">
                {videos.map((video) => (
                  <button key={video.youtubeId} type="button" aria-pressed={value === `video:${video.youtubeId}`} onClick={() => choose(`video:${video.youtubeId}`)} className={TILE}>
                    <VideoThumbnail youtubeId={video.youtubeId} />
                    <span className="block truncate bg-surface px-2 py-1 text-[11px] font-semibold text-text">{video.title}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="m-0 text-body-sm text-muted-foreground">
                This trek has no videos yet. Add them from the video library under “Photo gallery and videos”, save, then come back here.
              </p>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

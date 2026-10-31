"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { TextField } from "@/components/ui/TextField";

import { VIDEO_LIMITS as LIMIT, VIDEOS_PATH } from "../constants";
import { youtubeIdFrom, youtubeWatchUrl } from "../lib/youtube";
import type { LibraryVideo } from "../types";
import { VideoThumbnail } from "./VideoThumbnail";

type VideoPanelProps = {
  /** saveVideo bound to this video's id (null for a new one). */
  action: EditorSaveAction;
  /** The saved video; null for a new one. */
  video: LibraryVideo | null;
};

const STATUS_TONE = { saved: "text-whatsapp", unsaved: "text-saffron-ink", neutral: "text-muted-foreground" } as const;

/** Add a video (its YouTube link and title) or change a saved one's title, in a drawer over the list. */
export const VideoPanel = ({ action, video }: VideoPanelProps) => {
  const form = useEditorForm<"video">({ action, firstKey: "video", firstSectionWithError: () => undefined, isNew: !video });
  const router = useRouter();
  const [link, setLink] = useState("");
  const [status, tone] = form.saveStatus;
  const previewId = video?.youtubeId ?? youtubeIdFrom(link);

  const close = () => {
    if (form.isDirty && !window.confirm("Close without saving? Your changes to this video will be lost.")) return;
    router.push(VIDEOS_PATH, { scroll: false });
  };

  return (
    <SideDrawer
      kicker={video ? "Edit video" : "New video"}
      title={video ? video.title : "Add a YouTube video"}
      status={
        <p role="status" className={cn("m-0 text-xs font-semibold", STATUS_TONE[tone])}>
          {status}
        </p>
      }
      onClose={close}
    >
      <form noValidate onSubmit={form.handleSubmit} onChange={form.markDirty} className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
          {form.state.status === "error" && <FormAlert message={form.state.message} />}
          <VideoThumbnail youtubeId={previewId} className="max-w-90 rounded-md" />
          {video ? (
            <TextField
              name="youtubeLink"
              label="YouTube link"
              value={youtubeWatchUrl(video.youtubeId)}
              isReadOnly
              hint="Treks and guides use this video by its link, so it can't change. To use another video, add it as a new one."
            />
          ) : (
            <TextField
              name="link"
              label="YouTube link"
              value={link}
              onValueChange={setLink}
              placeholder="https://www.youtube.com/watch?v=…"
              hint="A watch, share or Shorts link. Only the link is saved: nothing is uploaded."
              error={form.errors.youtubeId}
            />
          )}
          <TextField
            name="title"
            label="Title"
            defaultValue={video?.title ?? ""}
            placeholder="Walking from Langtang Village to Kyanjin Gompa"
            hint="Shown with the video on trek pages, and in the admin to find it."
            maxLength={LIMIT.title}
            error={form.errors.title}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
          <Dialog.Close type="button" className={secondaryButton}>
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={form.isSaving} className={primaryButton}>
            {form.isSaving ? "Saving…" : video ? "Save changes" : "Add video"}
          </button>
        </div>
      </form>
    </SideDrawer>
  );
};

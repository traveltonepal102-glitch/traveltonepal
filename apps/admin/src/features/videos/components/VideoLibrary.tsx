import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";
import { LibraryFolderNav } from "@/features/photos/components/LibraryFolderNav";
import { MediaLibraryHeader } from "@/features/photos/components/MediaLibraryHeader";

import { NEW_VIDEO_PATH } from "../constants";
import { videoFolderHref } from "../lib/videoFolders";
import type { VideoFolder, VideoFolderSelection } from "../lib/videoFolders";
import type { LibraryVideo, VideoUse } from "../types";
import { LibraryVideoCard } from "./LibraryVideoCard";

type VideoLibraryProps = {
  folders: readonly VideoFolder[];
  selection: VideoFolderSelection;
  /** The videos in the open folder. */
  videos: readonly LibraryVideo[];
  usesByVideo: ReadonlyMap<string, readonly VideoUse[]>;
  canDelete: boolean;
  /** The add or edit drawer, when one is open (it shows over the list). */
  panel: ReactNode;
  /** What the last save did, e.g. "Video added."; null when there is nothing to say. */
  savedNotice: string | null;
};

/** "Treks › Mardi Himal Trek" */
const folderTitle = (folders: readonly VideoFolder[], { folder, item }: VideoFolderSelection) => {
  const open = folders.find((entry) => entry.key === folder);
  const openItem = open?.items.find((entry) => entry.id === item);
  return openItem ? `${open?.label} › ${openItem.label}` : (open?.label ?? "All videos");
};

/** The YouTube videos tab of Photos and videos: every library video in folders by where it is used. */
export const VideoLibrary = ({ folders, selection, videos, usesByVideo, canDelete, panel, savedNotice }: VideoLibraryProps) => (
  <>
    <MediaLibraryHeader
      tab="videos"
      description={
        <>
          Every YouTube video ({folders[0]?.count ?? 0}) treks and travel guides can show. Add a video once here with its link and title, then choose it in
          a trek or a guide. Only the link is saved, and the website plays a video only after the visitor clicks Play (privacy rules). A video can be deleted
          once nothing uses it{canDelete ? "" : " (by a Super admin)"}.
        </>
      }
      action={
        <Link href={NEW_VIDEO_PATH} scroll={false} className={primaryButton}>
          <Icon name="add" />
          Add video
        </Link>
      }
    />

    {savedNotice && (
      <p role="status" className="m-0 inline-flex items-center gap-1.5 self-start rounded-full bg-green-tint px-3 py-1 text-caption font-bold text-whatsapp">
        <Icon name="check_circle" size={16} />
        {savedNotice}
      </p>
    )}

    <div className="grid items-start gap-5 desktop:grid-cols-[240px_minmax(0,1fr)]">
      <LibraryFolderNav label="Video folders" folders={folders} selection={selection} hrefOf={videoFolderHref} />
      <section aria-labelledby="video-folder-title" className="flex min-w-0 flex-col gap-3">
        <h2 id="video-folder-title" className="m-0 font-display text-h4 text-ink">
          {folderTitle(folders, selection)} <span className="font-sans text-caption font-bold text-muted-foreground">({videos.length})</span>
        </h2>
        {videos.length > 0 ? (
          <ul className="m-0 grid list-none gap-3.5 p-0 tablet:grid-cols-2 desktop:grid-cols-3 min-[1500px]:grid-cols-4">
            {videos.map((video) => (
              <li key={video.id}>
                <LibraryVideoCard video={video} uses={usesByVideo.get(video.youtubeId) ?? []} canDelete={canDelete} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground">
            {selection.folder === "all" ? "No videos yet. Add the first one with “Add video”." : "No videos in this folder."}
          </p>
        )}
      </section>
    </div>
    {panel}
  </>
);

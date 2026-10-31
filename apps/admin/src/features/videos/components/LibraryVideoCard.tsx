import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import type { RemoveBlockerGroup } from "@/components/editor/types";
import { secondaryButton } from "@/components/ui/buttonStyles";
import { formatDateTime } from "@/utils/formatDateTime";

import { deleteVideo } from "../actions/deleteVideo";
import { videoPath } from "../constants";
import { folderLabelOfUse } from "../lib/videoFolders";
import { keyOfVideoUse, videoUseHref, videoUseLabel } from "../lib/videoUseLinks";
import { youtubeWatchUrl } from "../lib/youtube";
import type { LibraryVideo, VideoUse } from "../types";
import { VideoThumbnail } from "./VideoThumbnail";

type LibraryVideoCardProps = { video: LibraryVideo; uses: readonly VideoUse[]; canDelete: boolean };

/** Uses listed on the card; the rest are counted ("+3 more"). */
const SHOWN_USES = 4;

/** What still uses the video, by folder, for the delete window (it lists them instead of deleting). */
const blockersOf = (uses: readonly VideoUse[]): RemoveBlockerGroup[] => {
  const groups = new Map<string, VideoUse[]>();
  for (const use of uses) groups.set(folderLabelOfUse(use), [...(groups.get(folderLabelOfUse(use)) ?? []), use]);
  return [...groups.entries()].map(([label, groupUses]) => ({
    label: `Used in ${label}`,
    fix: "Choose another video there, or take this one off.",
    items: groupUses.map((use) => ({ id: keyOfVideoUse(use), name: videoUseLabel(use), href: videoUseHref(use) })),
  }));
};

/** One library video: YouTube's picture (opens it on YouTube), its title, where it is used, Edit and Delete. */
export const LibraryVideoCard = ({ video, uses, canDelete }: LibraryVideoCardProps) => (
  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-solid border-border bg-surface">
    <a href={youtubeWatchUrl(video.youtubeId)} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      <VideoThumbnail youtubeId={video.youtubeId} hasPlayIcon />
      <span className="sr-only">Watch “{video.title}” on YouTube (opens a new tab)</span>
    </a>
    <div className="flex flex-1 flex-col gap-2 p-3.5">
      <div className="min-w-0">
        <p className="m-0 line-clamp-2 text-caption font-bold text-ink">{video.title}</p>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">
          youtu.be/{video.youtubeId} · {formatDateTime(video.createdAt)}
        </p>
      </div>

      {uses.length > 0 ? (
        <ul aria-label="Used in" className="m-0 flex list-none flex-col gap-1 p-0">
          {uses.slice(0, SHOWN_USES).map((use) => (
            <li key={keyOfVideoUse(use)} className="min-w-0">
              <Link href={videoUseHref(use)} className="block truncate text-xs font-semibold text-brand hover:underline">
                {videoUseLabel(use)}
              </Link>
            </li>
          ))}
          {uses.length > SHOWN_USES && <li className="text-xs text-muted-foreground">+{uses.length - SHOWN_USES} more</li>}
        </ul>
      ) : (
        <p className="m-0 self-start rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">Not used yet</p>
      )}

      <div className="mt-auto flex flex-wrap justify-end gap-2 pt-1">
        <Link href={videoPath(video.id)} scroll={false} className={cn(secondaryButton, "min-h-9 px-3 text-caption")}>
          <Icon name="edit" size={16} />
          Edit title
        </Link>
        {canDelete && (
          <ConfirmRemoveButton
            name={`“${video.title}”`}
            verb="delete"
            consequence="It leaves the library. The video stays on YouTube."
            action={deleteVideo.bind(null, video.id)}
            blockers={blockersOf(uses)}
          />
        )}
      </div>
    </div>
  </article>
);

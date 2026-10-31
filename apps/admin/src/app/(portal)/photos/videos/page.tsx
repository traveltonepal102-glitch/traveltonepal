import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { saveVideo } from "@/features/videos/actions/saveVideo";
import { VideoLibrary } from "@/features/videos/components/VideoLibrary";
import { VideoPanel } from "@/features/videos/components/VideoPanel";
import { SAVED_NOTICES } from "@/features/videos/constants";
import { buildVideoFolders, parseVideoFolderSelection, usesByVideo, videosInFolder } from "@/features/videos/lib/videoFolders";
import { listVideoUses, listVideos } from "@/features/videos/services/videosRepository";

export const metadata: Metadata = { title: `YouTube videos · ${ADMIN_SECTIONS.photos.label}` };

/**
 * The YouTube videos tab of Photos and videos: the library in folders by where each video is used.
 * "?folder=treks&item=<trek id>" opens a folder, "?video=<id>" a video's edit panel, "?video=new" an empty one.
 */
const VideosPage = async ({ searchParams }: PageProps<"/photos/videos">) => {
  const admin = await requireAdmin();
  const [videos, uses, params] = await Promise.all([listVideos(), listVideoUses(), searchParams]);
  const selection = parseVideoFolderSelection(params);

  const openId = typeof params.video === "string" ? params.video : null;
  const open = videos.find((video) => video.id === openId) ?? null;
  const panel = (open || openId === "new") && (
    // A fresh form for each video (nothing typed for one carries over to another).
    <VideoPanel key={open?.id ?? "new"} action={saveVideo.bind(null, open?.id ?? null)} video={open} />
  );
  const savedNotice = Object.entries(SAVED_NOTICES).find(([notice]) => notice === params.saved)?.[1] ?? null;

  return (
    <VideoLibrary
      folders={buildVideoFolders(videos, uses)}
      selection={selection}
      videos={videosInFolder(videos, uses, selection)}
      usesByVideo={usesByVideo(uses)}
      canDelete={admin.role === "super_admin"}
      panel={panel || null}
      savedNotice={panel ? null : savedNotice}
    />
  );
};

export default VideosPage;

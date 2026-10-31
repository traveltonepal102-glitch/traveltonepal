import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Image from "next/image";

import { youtubeThumbnail } from "../lib/youtube";

type VideoThumbnailProps = {
  /** null shows an empty frame (no video chosen yet). */
  youtubeId: string | null;
  /** A play symbol over the picture. */
  hasPlayIcon?: boolean;
  className?: string;
};

/** YouTube's own small picture of the video (16:9), shown as it is: nothing is uploaded or resized. */
export const VideoThumbnail = ({ youtubeId, hasPlayIcon = false, className }: VideoThumbnailProps) => (
  <span className={cn("relative flex aspect-video items-center justify-center overflow-hidden bg-navy text-white/50", className)}>
    {youtubeId ? <Image src={youtubeThumbnail(youtubeId)} alt="" width={320} height={180} unoptimized className="h-full w-full object-cover" /> : <Icon name="smart_display" size={36} />}
    {youtubeId && hasPlayIcon && <Icon name="play_circle" size={34} className="absolute inset-0 m-auto text-white drop-shadow" />}
  </span>
);

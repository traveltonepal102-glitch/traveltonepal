import { articlePath } from "@/features/travel-guides/constants";
import { trekPath } from "@/features/treks/constants";

import type { VideoUse } from "../types";

/** Where to change the video: the editor of what uses it. */
export const videoUseHref = ({ kind, itemId }: VideoUse) => (kind === "trek" ? trekPath(itemId) : articlePath(itemId));

/** "Mardi Himal Trek · Videos", "Best time to visit Nepal · Section 4". */
export const videoUseLabel = (use: VideoUse) => `${use.itemLabel} · ${use.detail}`;

export const keyOfVideoUse = (use: VideoUse) => `${use.kind}-${use.itemId}-${use.detail}`;

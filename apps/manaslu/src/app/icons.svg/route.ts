import { iconSpriteResponse } from "@ttn/ui/lib/iconSprite";

import { TRAIL_ICON_PATHS, TRAIL_ICON_VIEW_BOX } from "@/components/ui/trailIconPaths";

/** /icons.svg: the website's icon set as one sprite, built once (it reads nothing from the request, so it is prerendered) and cached for a year (every <TrailIcon> points into it). */
export const GET = () => iconSpriteResponse(TRAIL_ICON_PATHS, TRAIL_ICON_VIEW_BOX);

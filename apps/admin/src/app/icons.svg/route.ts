import { iconSprite } from "@ttn/ui/icon";

/** /icons.svg: the icon set as one sprite, cached for a year (every <Icon> points into it). Public on purpose: it holds only the icons' shapes. */
export const dynamic = "force-static";

export const GET = () => iconSprite();

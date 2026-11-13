import { iconSprite } from "@ttn/ui/icon";

/** /icons.svg: the website's icon set as one sprite, built once (it reads nothing from the request, so it is prerendered) and cached for a year (every <Icon> points into it). */
export const GET = () => iconSprite();

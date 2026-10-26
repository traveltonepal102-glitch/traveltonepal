import type { SVGProps } from "react";

import { ICON_PATHS } from "./icons/paths";
import type { IconName } from "./icons/paths";

export type { IconName };

/** True for a name in the icon set (e.g. one read from the database). */
export const isIconName = (value: unknown): value is IconName => typeof value === "string" && Object.hasOwn(ICON_PATHS, value);

type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "name"> & {
  name: IconName;
  /** px; the design uses 20 or 24 next to text, smaller inside chips. */
  size?: number;
  /** Only for an icon that stands alone with no text; otherwise it is hidden from screen readers. */
  label?: string;
};

/** Material Symbols icon as inline SVG. Takes the surrounding text color (currentColor). */
export const Icon = ({ name, size = 20, label, ...svgProps }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 -960 960 960"
    fill="currentColor"
    focusable="false"
    {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    {...svgProps}
  >
    <path d={ICON_PATHS[name]} />
  </svg>
);

import { SiteImage } from "@/components/ui/SiteImage";
import type { SiteImageSource } from "@/lib/images";

type ReviewerAvatarProps = {
  name: string;
  photo?: SiteImageSource;
  /** Tailwind size of the circle, e.g. "size-11". */
  className: string;
  /** Its width in px, so the browser loads the smallest photo size. */
  sizePx: number;
};

/** The first letter of a name, even when it is an accent or emoji (one character, not one code unit). */
const initialOf = (name: string) => Array.from(name.trim())[0]?.toLocaleUpperCase() ?? "";

/**
 * The reviewer's round photo, or the first letter of their name in a circle (as Google shows reviewers without one).
 * Decorative: the name is written next to it.
 */
export const ReviewerAvatar = ({ name, photo, className, sizePx }: ReviewerAvatarProps) => (
  <span
    aria-hidden="true"
    className={`relative inline-flex flex-none items-center justify-center overflow-hidden rounded-full bg-brand font-display font-bold text-on-brand ${className}`}
  >
    {photo ? <SiteImage image={{ ...photo, alt: "" }} sizes={`${sizePx}px`} className="object-cover" /> : initialOf(name)}
  </span>
);

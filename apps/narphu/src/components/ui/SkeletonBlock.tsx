type SkeletonBlockProps = {
  /** Size, shape and colour of the placeholder, e.g. "h-8 w-3/4 bg-line" or "h-9 w-40 rounded-full bg-line". */
  className: string;
};

/**
 * A placeholder shape that pulses while a page loads; it stays still for visitors who reduce motion. Its corners are
 * `rounded-md` unless the class names its own: two rounding classes on one element would leave the winner to the order
 * of Tailwind's CSS, where `rounded-md` beats `rounded-full`, `rounded-2xl` and `rounded-lg`.
 */
export const SkeletonBlock = ({ className }: SkeletonBlockProps) => (
  <div
    aria-hidden="true"
    className={`animate-pulse motion-reduce:animate-none ${className.includes("rounded-") ? "" : "rounded-md"} ${className}`}
  />
);

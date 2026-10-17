/**
 * Drawn ridgelines for a region tile without a photo. Uses white/black tints so it sits on any
 * tile color. Decorative.
 */
export const RegionTileArt = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 400 120"
    preserveAspectRatio="none"
    className="absolute inset-x-0 bottom-0 h-1/2 w-full"
  >
    <path
      d="M0 120 L0 70 L40 45 L70 62 L110 20 L150 55 L190 35 L230 60 L270 15 L320 50 L360 38 L400 58 L400 120 Z"
      className="fill-white/15"
    />
    <path d="M110 20 L101 31 L106 30 L110 36 L114 29 L120 31 Z" className="fill-white/85" />
    <path d="M270 15 L261 27 L266 25 L270 31 L275 24 L281 27 Z" className="fill-white/85" />
    <path d="M0 120 L0 95 L60 82 L120 98 L180 80 L250 96 L310 84 L400 100 L400 120 Z" className="fill-black/25" />
  </svg>
);

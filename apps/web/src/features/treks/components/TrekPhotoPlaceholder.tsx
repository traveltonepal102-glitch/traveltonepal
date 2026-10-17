/** Drawn mountains for a trek that has no photo yet. Decorative. */
export const TrekPhotoPlaceholder = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 400 225"
    preserveAspectRatio="none"
    className="absolute inset-0 size-full"
  >
    <circle cx="310" cy="60" r="20" className="fill-saffron" />
    <path d="M0 225 L0 135 L70 100 L120 122 L190 54 L240 100 L290 72 L340 112 L400 90 L400 225 Z" className="fill-chart-3" />
    <path d="M0 225 L0 180 L90 158 L170 176 L250 154 L330 174 L400 156 L400 225 Z" className="fill-navy" />
  </svg>
);

const PRAYER_FLAGS = [
  { x: 60, y: 50, color: "fill-saffron" },
  { x: 110, y: 60, color: "fill-brand" },
  { x: 160, y: 66, color: "fill-white stroke-line-strong" },
  { x: 210, y: 68, color: "fill-whatsapp" },
  { x: 260, y: 66, color: "fill-danger" },
  { x: 310, y: 60, color: "fill-saffron" },
  { x: 360, y: 52, color: "fill-brand" },
  { x: 410, y: 42, color: "fill-white stroke-line-strong" },
] as const;

/** A trail that stops at a broken bridge, prayer flags above (design: NotFound.dc.html). Decorative. */
export const TrailEndIllustration = () => (
  <svg aria-hidden="true" viewBox="0 0 480 340" className="block w-full overflow-hidden rounded-xl">
    <rect width="480" height="340" className="fill-brand-tint" />
    <circle cx="404" cy="132" r="26" className="fill-saffron" />
    <path d="M0 230 L70 160 L118 190 L196 92 L250 150 L300 118 L360 176 L420 140 L480 180 L480 340 L0 340 Z" className="fill-chart-3" />
    <path
      d="M196 92 L180 114 L190 111 L196 124 L204 110 L213 114 Z M300 118 L290 132 L297 130 L300 138 L305 129 L312 132 Z"
      className="fill-white"
    />
    <path d="M0 270 L90 236 L160 256 L200 246 L200 340 L0 340 Z" className="fill-brand" />
    <path d="M280 250 L360 230 L480 252 L480 340 L280 340 Z" className="fill-brand" />
    <path d="M0 300 L120 288 L200 296 L200 340 L0 340 Z" className="fill-navy" />
    <path d="M280 300 L400 290 L480 298 L480 340 L280 340 Z" className="fill-navy" />
    <path
      d="M30 318 Q90 300 150 284 T200 262"
      fill="none"
      strokeWidth="4"
      strokeDasharray="2 10"
      strokeLinecap="round"
      className="stroke-page"
    />
    <path d="M200 262 L218 268 M200 270 L214 282" strokeWidth="4" strokeLinecap="round" className="stroke-saffron" />
    <path d="M280 262 L266 270 M280 272 L268 284" strokeWidth="4" strokeLinecap="round" className="stroke-saffron" />
    <rect x="150" y="200" width="6" height="64" rx="2" className="fill-ink" />
    <rect x="104" y="196" width="98" height="34" rx="6" strokeWidth="3" className="fill-white stroke-ink" />
    <text x="153" y="220" textAnchor="middle" fontSize="18" fontWeight="800" className="fill-ink font-display">
      404
    </text>
    <path d="M24 40 Q240 92 456 30" fill="none" strokeWidth="2" className="stroke-muted-foreground" />
    {PRAYER_FLAGS.map((flag) => (
      <rect key={flag.x} x={flag.x} y={flag.y} width="22" height="30" rx="3" className={flag.color} />
    ))}
  </svg>
);

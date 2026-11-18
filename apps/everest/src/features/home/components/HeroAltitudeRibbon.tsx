import { formatAltitude } from "@/lib/format";

import type { HomeDay } from "../types";

const WIDTH = 1000;
const HEIGHT = 120;
/** Room above the line for the peak's marker and below it for the fill to fade out. */
const TOP = 18;
const BOTTOM = 112;

/**
 * The altitude ribbon in the hero (design: canvas "Everest Trek Website", Home top): the trek's height day by day as one
 * line drawn across the photo, with the highest point marked. Worked out from the itinerary's days on the server; the
 * numbers are in the itinerary below, so the drawing is decoration and the caption says it in words.
 */
export const HeroAltitudeRibbon = ({ days }: { days: readonly HomeDay[] }) => {
  if (days.length < 2) return null;
  const heights = days.map((day) => day.altitudeM);
  const low = Math.min(...heights);
  const high = Math.max(...heights);
  const span = Math.max(high - low, 1);
  const points = heights.map((height, index) => [(index / (days.length - 1)) * WIDTH, BOTTOM - ((height - low) / span) * (BOTTOM - TOP)] as const);
  const line = `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}`;
  const peakIndex = heights.indexOf(high);
  const peak = days[peakIndex];
  const [peakX, peakY] = points[peakIndex] ?? [0, 0];

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="relative h-24 w-full sm:h-28">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="hero-ribbon-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-glacier)" stopOpacity="0.45" />
              <stop offset="1" stopColor="var(--color-glacier)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`} fill="url(#hero-ribbon-fill)" />
          <path d={line} fill="none" stroke="var(--color-on-ink-label)" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="ribbon-draw" pathLength={1} />
        </svg>
        <span
          aria-hidden="true"
          className="ribbon-pulse absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-snow bg-glacier"
          style={{ left: `${(peakX / WIDTH) * 100}%`, top: `${(peakY / HEIGHT) * 100}%` }}
        />
      </div>
      {peak && (
        <figcaption className="flex flex-wrap justify-between gap-2 text-[13px] leading-4.5 font-semibold tracking-[0.08em] text-on-ink-label uppercase">
          <span>
            Tag 1 · {formatAltitude(days[0]?.altitudeM ?? low)}
          </span>
          <span className="text-snow">
            Höchster Punkt: {peak.topPlace} · {formatAltitude(high)} · Tag {peak.number}
          </span>
          <span>
            Tag {days.length} · {formatAltitude(days.at(-1)?.altitudeM ?? low)}
          </span>
        </figcaption>
      )}
    </figure>
  );
};

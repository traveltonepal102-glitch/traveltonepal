import { formatAltitude } from "@/features/treks/format";

import { ELEVATION_CHART } from "../../elevation";
import type { ElevationPointRole, ElevationProfile } from "../../elevation";

/** Marker per point role; descent days have none (the way down repeats the way up). */
const MARKERS: Record<ElevationPointRole, { r: number; className: string } | null> = {
  start: { r: 5, className: "fill-muted-foreground" },
  climb: { r: 6, className: "fill-brand" },
  highestNight: { r: 7, className: "fill-whatsapp" },
  summit: { r: 8, className: "fill-saffron stroke-navy stroke-2" },
  descent: null,
};

// Sizes are in chart units: the chart is drawn about 70% of its 1080-unit width, so 14 reads as ~10px.
const LABELS: Record<ElevationPointRole, string> = {
  start: "fill-muted-foreground text-[14px]",
  climb: "fill-text text-[14px] font-bold",
  highestNight: "fill-whatsapp text-[15px] font-bold",
  summit: "fill-navy text-[16px] font-bold",
  descent: "",
};

const AXIS_TEXT = "fill-muted-foreground text-[14px]";
/** Room left of the plot for the metre labels ("5,500 m"). */
const AXIS_GUTTER = 30;

/** The daily altitude curve: grid with metre ticks, filled area, line, markers, place and day labels (one per night). */
export const ElevationChart = ({ profile }: { profile: ElevationProfile }) => {
  const { width, height, left, right, bottom } = ELEVATION_CHART;

  return (
    <svg
      role="img"
      aria-label={profile.description}
      viewBox={`${-AXIS_GUTTER} 0 ${width + AXIS_GUTTER} ${height}`}
      className="my-4 block h-auto w-full min-w-160 font-sans"
    >
      {profile.gridLines.map((line) => (
        <g key={line.altitudeM}>
          <path d={`M${left - 20} ${line.y} H${right + 40}`} strokeWidth={1} className="stroke-line" />
          <text x={left - 24} y={line.y + 4} textAnchor="end" className={AXIS_TEXT}>
            {formatAltitude(line.altitudeM)}
          </text>
        </g>
      ))}

      <path d={profile.areaPath} className="fill-brand-tint" />
      <path d={profile.linePath} fill="none" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" className="stroke-brand" />

      {profile.points.map((point) => {
        const marker = MARKERS[point.role];
        return (
          <g key={`${point.day}-${point.kind}`}>
            {marker && <circle cx={point.x} cy={point.y} r={marker.r} className={marker.className} />}
            {point.label && (
              <text
                x={point.label.x}
                y={point.label.y}
                textAnchor={point.label.anchor}
                // White outline keeps a label readable where it crosses the curve.
                className={`${LABELS[point.role]} stroke-white stroke-4 [paint-order:stroke] [stroke-linejoin:round]`}
              >
                {point.label.text}
              </text>
            )}
            {point.kind === "night" && (
              <text x={point.x} y={bottom + 24} textAnchor="middle" className={AXIS_TEXT}>
                D{point.day}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

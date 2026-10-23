import { ALTITUDE_CHART as BOX, buildAltitudeProfile } from "../../../lib/altitudeProfile";

type AltitudeChartProps = {
  /** One per day, in order; null while a day has no altitude yet. */
  altitudes: (number | null)[];
};

const metres = (value: number) => `${value.toLocaleString("en")} m`;

/** The altitude profile drawn from the days, as on the trek page. Updates while you type. */
export const AltitudeChart = ({ altitudes }: AltitudeChartProps) => {
  const profile = buildAltitudeProfile(altitudes);
  if (!profile) {
    return (
      <p className="m-0 rounded-md border border-dashed border-line-strong bg-page px-4 py-6 text-center text-caption text-muted-foreground">
        The chart appears once two days have an altitude.
      </p>
    );
  }

  const { peak } = profile;
  const labelEvery = altitudes.length > 16 ? 2 : 1;

  return (
    <svg
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      role="img"
      aria-label={`Altitude profile: highest point ${metres(peak.altitudeM)} on day ${peak.day}.`}
      className="block h-auto w-full"
    >
      {profile.gridLines.map((line) => (
        <g key={line.altitudeM}>
          <line x1={BOX.left} x2={BOX.right} y1={line.y} y2={line.y} className="stroke-border" strokeDasharray="4 4" />
          <text x={BOX.left - 8} y={line.y + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
            {metres(line.altitudeM)}
          </text>
        </g>
      ))}
      <path d={profile.areaPath} className="fill-brand/10" />
      <path d={profile.linePath} className="fill-none stroke-brand" strokeWidth={2.5} strokeLinejoin="round" />
      {profile.points.map((point) => (
        <circle
          key={point.day}
          cx={point.x}
          cy={point.y}
          r={point === peak ? 6 : 4}
          className={point === peak ? "fill-saffron stroke-surface" : "fill-brand stroke-surface"}
          strokeWidth={2}
        />
      ))}
      <text x={peak.x} y={peak.y - 12} textAnchor="middle" className="fill-saffron-ink text-[13px] font-bold">
        {metres(peak.altitudeM)}
      </text>
      {altitudes.map((_, index) =>
        index % labelEvery === 0 ? (
          <text
            key={index}
            x={BOX.left + (altitudes.length === 1 ? 0 : (index / (altitudes.length - 1)) * (BOX.right - BOX.left))}
            y={BOX.bottom + 22}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px]"
          >
            Day {index + 1}
          </text>
        ) : null,
      )}
    </svg>
  );
};

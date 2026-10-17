import type { RouteSketch as RouteSketchData } from "../../types";
import { MAP_COLORS, PIN_STYLES } from "../route/mapStyles";
import { PANEL } from "../styles";

/** Hand-drawn route overview: valley, river, the trail, a dashed side hike and the main stops. */
export const RouteSketch = ({ sketch }: { sketch: RouteSketchData }) => (
  <figure className={`${PANEL} mx-auto w-full max-w-115 p-3`}>
    <svg role="img" aria-label={sketch.description} viewBox="0 0 1000 560" className="block h-auto w-full rounded-md">
      <rect width="1000" height="560" fill={MAP_COLORS.background} />
      <path d={sketch.groundPath} fill={MAP_COLORS.ground} />
      <path d={sketch.peaksPath} fill="#fff" stroke={MAP_COLORS.snowEdge} strokeWidth={2} />
      <path d={sketch.riverPath} fill="none" stroke={MAP_COLORS.river} strokeWidth={8} />
      <path d={sketch.routePath} fill="none" strokeWidth={8} strokeLinecap="round" className="stroke-brand" />
      {sketch.sideHikePath && (
        <path d={sketch.sideHikePath} fill="none" strokeWidth={7} strokeDasharray="12 8" strokeLinecap="round" className="stroke-saffron" />
      )}
      {sketch.pins.map((pin) => (
        <circle key={pin.name} cx={pin.x} cy={pin.y} r={13} stroke="#fff" strokeWidth={4} className={PIN_STYLES[pin.kind].fill} />
      ))}
      {/* White outline behind the letters keeps them readable on the river and trail lines. */}
      <g
        fontSize={28}
        fontWeight={700}
        textAnchor="middle"
        stroke="#fff"
        strokeWidth={6}
        strokeLinejoin="round"
        className="fill-ink font-sans [paint-order:stroke]"
      >
        {sketch.labels.map((label) => (
          <text key={label.text} x={label.x} y={label.y}>
            {label.text}
          </text>
        ))}
      </g>
    </svg>
    <figcaption className="mt-2 text-center text-[11px] font-medium text-muted-foreground">{sketch.caption}</figcaption>
  </figure>
);

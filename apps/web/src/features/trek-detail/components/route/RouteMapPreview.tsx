import { formatAltitude } from "@/features/treks/format";

import type { RoutePin, RouteSketch } from "../../types";
import { MAP_COLORS, MAP_LABEL_STYLES, PIN_STYLES } from "./mapStyles";

/** Generic terrain texture (bands and contour lines) behind every route map. */
const TERRAIN = {
  lowGround: "M0 450 C 140 420, 300 460, 460 400 S 760 330, 1000 360 L1000 560 L0 560 Z",
  snowfield: "M0 150 C 150 130, 300 170, 420 140 S 640 70, 780 90 S 920 60, 1000 70 L1000 0 L0 0 Z",
  contours:
    "M40 210 C 160 190, 280 220, 400 190 S 620 130, 760 150 S 920 120, 1000 130 M0 260 C 140 240, 280 270, 400 240 S 620 180, 760 195 S 920 175, 1000 180",
  lowContours: "M0 520 C 160 490, 320 520, 480 470 S 780 400, 1000 420 M0 380 C 150 360, 300 390, 440 350 S 700 290, 1000 300",
} as const;

/** Map-pin shape in a 24×24 box; its tip (12, 22) is scaled ×1.4 onto the place. */
const PIN_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";
const LABEL_HALO = "[paint-order:stroke] stroke-white stroke-5 [stroke-linejoin:round]";

const Pin = ({ pin }: { pin: RoutePin }) => {
  const isLeft = pin.labelSide === "left";
  const labelX = isLeft ? pin.x - 22 : pin.x;
  const anchor = isLeft ? "end" : "middle";

  return (
    <g>
      <g transform={`translate(${pin.x - 16.8} ${pin.y - 30.8}) scale(1.4)`}>
        <path d={PIN_PATH} strokeWidth={0.8} className={`${PIN_STYLES[pin.kind].fill} ${PIN_STYLES[pin.kind].stroke}`} />
        <circle cx={12} cy={9} r={2.6} fill="#fff" fillOpacity={0.85} />
      </g>
      <g textAnchor={anchor} className={LABEL_HALO}>
        <text x={labelX} y={isLeft ? pin.y - 12 : pin.y + 26} fontSize={18} fontWeight={700} className="fill-ink">
          {pin.name}
        </text>
        <text x={labelX} y={isLeft ? pin.y + 6 : pin.y + 43} fontSize={14} className="fill-[#4a5560]">
          {formatAltitude(pin.altitudeM)}
        </text>
      </g>
    </g>
  );
};

/** Drawn route map with every stop and its altitude: shown until the visitor loads the Google map. */
export const RouteMapPreview = ({ sketch }: { sketch: RouteSketch }) => (
  <svg
    role="img"
    aria-label={`${sketch.description}, with ${sketch.pins.map((pin) => `${pin.name} (${formatAltitude(pin.altitudeM)})`).join(", ")}`}
    viewBox="0 0 1000 560"
    className="block h-auto w-[180%] max-w-none font-sans sm:w-full"
  >
    <rect width="1000" height="560" fill={MAP_COLORS.background} />
    <path d={sketch.groundPath} fill={MAP_COLORS.ground} />
    <path d={TERRAIN.lowGround} fill={MAP_COLORS.lowGround} />
    <path d={TERRAIN.snowfield} fill={MAP_COLORS.snowfield} />
    <path d={TERRAIN.contours} fill="none" stroke={MAP_COLORS.contour} strokeWidth={2} />
    <path d={TERRAIN.lowContours} fill="none" stroke={MAP_COLORS.lowContour} strokeWidth={2} />
    <path d={sketch.peaksPath} fill="#fff" stroke={MAP_COLORS.snowEdge} strokeWidth={2} />
    <path d={sketch.riverPath} fill="none" stroke={MAP_COLORS.river} strokeWidth={7} strokeLinecap="round" />

    {sketch.approachPath && (
      <>
        <path d={sketch.approachPath} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        <path d={sketch.approachPath} fill="none" stroke={MAP_COLORS.road} strokeWidth={7} strokeLinecap="round" />
      </>
    )}
    <path d={sketch.routePath} fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" />
    <path d={sketch.routePath} fill="none" strokeWidth={5} strokeLinecap="round" className="stroke-brand" />
    {sketch.sideHikePath && (
      <path d={sketch.sideHikePath} fill="none" strokeWidth={5} strokeDasharray="10 7" strokeLinecap="round" className="stroke-saffron" />
    )}
    {sketch.optionPath && (
      <path d={sketch.optionPath} fill="none" strokeWidth={4} strokeDasharray="8 7" strokeLinecap="round" className="stroke-footer-muted" />
    )}

    <g className={LABEL_HALO}>
      {sketch.mapLabels?.map((label) => (
        <text key={label.text} x={label.x} y={label.y} fontSize={label.kind === "park" ? 17 : label.kind === "peak" ? 15 : 14} className={MAP_LABEL_STYLES[label.kind]}>
          {label.text}
        </text>
      ))}
    </g>
    {sketch.pins.map((pin) => (
      <Pin key={pin.name} pin={pin} />
    ))}
  </svg>
);

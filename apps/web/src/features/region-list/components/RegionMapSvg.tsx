"use client";

import { HIMALAYA_PATH, KATHMANDU, NEPAL_MAP_VIEWBOX, NEPAL_OUTLINE_PATH, POKHARA, projectToMap } from "@/features/regions/nepalMap";

import type { RegionListItem } from "../regionListItems";

type RegionMapSvgProps = {
  regions: readonly RegionListItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const CITIES = [
  { name: "Kathmandu", point: KATHMANDU, labelDy: 5 },
  { name: "Pokhara", point: POKHARA, labelDy: 22 },
] as const;

const HALO = "[paint-order:stroke] stroke-white [stroke-linejoin:round]";

/**
 * Schematic map with a numbered pin per region. Pins answer to the mouse; keyboard and screen-reader
 * users pick regions from the list under the map, which does the same thing.
 */
export const RegionMapSvg = ({ regions, selectedIndex, onSelect }: RegionMapSvgProps) => {
  const selected = regions[selectedIndex];
  const selectedPoint = selected && projectToMap(selected.location.lon, selected.location.lat);

  return (
    <svg
      role="img"
      aria-label={`Schematic map of Nepal with the ${regions.length} trekking regions numbered from west to east`}
      viewBox={NEPAL_MAP_VIEWBOX}
      className="block h-auto w-full font-sans"
    >
      <defs>
        <linearGradient id="regions-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f8fc" />
          <stop offset="1" stopColor="#e6eef5" />
        </linearGradient>
      </defs>
      <path d={NEPAL_OUTLINE_PATH} fill="url(#regions-land)" stroke="#9db6ce" strokeWidth={2.5} strokeLinejoin="round" />
      <path d={HIMALAYA_PATH} fill="none" stroke="#c4d6e6" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      <text x={300} y={150} fontSize={13} className="fill-[#7c93a8] italic">
        High Himalaya
      </text>

      {CITIES.map((city) => (
        <g key={city.name}>
          <rect x={city.point.x - 5} y={city.point.y - 5} width={10} height={10} transform={`rotate(45 ${city.point.x} ${city.point.y})`} className="fill-ink" />
          <text x={city.point.x + 12} y={city.point.y + city.labelDy} fontSize={14} fontWeight={600} className="fill-text">
            {city.name}
          </text>
        </g>
      ))}

      {regions.map((region, index) => {
        const { x, y } = projectToMap(region.location.lon, region.location.lat);
        const isSelected = index === selectedIndex;
        return (
          <g key={region.slug} onClick={() => onSelect(index)} className="cursor-pointer">
            {isSelected && <circle cx={x} cy={y} r={30} className="fill-saffron/30" />}
            <circle cx={x} cy={y} r={isSelected ? 19 : 14} stroke="#fff" strokeWidth={3} className={isSelected ? "fill-saffron" : "fill-brand"} />
            <text
              x={x}
              y={y + (isSelected ? 7 : 5)}
              textAnchor="middle"
              fontSize={isSelected ? 18 : 14}
              fontWeight={800}
              className="pointer-events-none fill-white font-display"
            >
              {region.number}
            </text>
          </g>
        );
      })}

      {selected && selectedPoint && (
        <text x={selectedPoint.x} y={selectedPoint.y - 38} textAnchor="middle" fontSize={20} fontWeight={800} strokeWidth={6} className={`fill-navy font-display ${HALO}`}>
          {selected.name}
        </text>
      )}
      <text x={985} y={490} textAnchor="end" fontSize={11} className="fill-subtle">
        Schematic map, not to scale
      </text>
    </svg>
  );
};

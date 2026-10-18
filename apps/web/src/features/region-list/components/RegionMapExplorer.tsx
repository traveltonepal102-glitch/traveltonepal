"use client";

import { useState } from "react";

import { MapConsentGate } from "@/components/shared/MapConsentGate";
import type { GoogleMapsConfig } from "@/lib/googleMaps/config";

import type { RegionListItem } from "../regionListItems";
import { RegionGoogleMap } from "./RegionGoogleMap";
import { RegionMapSvg } from "./RegionMapSvg";
import { SelectedRegionCard } from "./SelectedRegionCard";
import { CARD } from "./styles";

type RegionMapExplorerProps = {
  regions: readonly RegionListItem[];
  /** The region shown when the page opens. */
  initialSlug: string;
  /** Maps API settings for the map with every region pinned; without a key, a keyless embed of the selected region. */
  googleMaps: GoogleMapsConfig | null;
};

/** Map, numbered region list and the selected region's card; the map and the list pick the same region. */
export const RegionMapExplorer = ({ regions, initialSlug, googleMaps }: RegionMapExplorerProps) => {
  const [selectedIndex, setSelectedIndex] = useState(() => Math.max(0, regions.findIndex((region) => region.slug === initialSlug)));
  const selected = regions[selectedIndex];
  if (!selected) return null;

  const drawnMap = <RegionMapSvg regions={regions} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />;

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <div className={`${CARD} flex flex-col gap-3.5 p-4.5 md:p-5`}>
        {/* Large screens: the map grows to match the region card's height. */}
        <MapConsentGate preview={drawnMap} previewLabel="Regions map" className="lg:flex-1">
          {googleMaps ? (
            <RegionGoogleMap
              config={googleMaps}
              regions={regions}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              fallback={drawnMap}
            />
          ) : (
            <iframe
              src={selected.mapEmbedUrl}
              title={`Google map of the ${selected.name} region`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-4/3 w-full border-0 sm:aspect-2/1 lg:aspect-auto lg:h-full lg:min-h-90"
            />
          )}
        </MapConsentGate>
        <ul aria-label="Regions" className="grid grid-cols-2 gap-1.5 md:grid-cols-3">
          {regions.map((region, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li key={region.slug}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex min-h-9.5 w-full cursor-pointer items-center gap-2 rounded-md border px-2 py-1 text-left text-caption font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    isSelected ? "border-chart-3 bg-brand-tint text-navy" : "border-[#eef2f6] bg-surface text-text hover:border-chart-3"
                  }`}
                >
                  <span
                    className={`inline-flex size-5.5 flex-none items-center justify-center rounded-full text-[11px] font-extrabold ${
                      isSelected ? "bg-saffron text-ink" : "bg-brand text-white"
                    }`}
                  >
                    {region.number}
                  </span>
                  {region.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <SelectedRegionCard region={selected} />
    </div>
  );
};

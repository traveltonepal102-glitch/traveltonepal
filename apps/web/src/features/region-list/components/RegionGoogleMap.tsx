"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { ReactNode } from "react";

import type { GoogleMapsConfig } from "@/lib/googleMaps/config";
import { loadGoogleMaps } from "@/lib/googleMaps/loader";
import type { AdvancedMarker, GoogleMap, LatLng } from "@/lib/googleMaps/loader";

import type { RegionListItem } from "../regionListItems";
import { createPinElement } from "./regionPin";

type RegionGoogleMapProps = {
  config: GoogleMapsConfig;
  regions: readonly RegionListItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  /** Shown instead if Google Maps cannot load (bad key, offline). */
  fallback: ReactNode;
};

/** Roughly the middle of Nepal, before the map fits itself to the pins. */
const NEPAL_CENTER: LatLng = { lat: 28.3, lng: 84.1 };
const BOUNDS_PADDING = 48;

const positionOf = (region: RegionListItem): LatLng => ({ lat: region.location.lat, lng: region.location.lon });

/**
 * Google terrain map, zoomed out to every region's numbered pin. Clicking a pin selects the region; selecting
 * one in the list highlights its pin, and moves the map only when that pin is out of view (all pins stay visible).
 */
export const RegionGoogleMap = ({ config, regions, selectedIndex, onSelect, fallback }: RegionGoogleMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<AdvancedMarker[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const select = useEffectEvent(onSelect);
  const initialSelection = useEffectEvent(() => selectedIndex);

  useEffect(() => {
    let isCancelled = false;
    loadGoogleMaps(config.apiKey)
      .then((maps) => {
        const container = containerRef.current;
        if (isCancelled || !container) return;
        const map = new maps.Map(container, {
          center: NEPAL_CENTER,
          zoom: 7,
          mapId: config.mapId,
          mapTypeId: "terrain",
          gestureHandling: "cooperative",
          streetViewControl: false,
        });
        const bounds = new maps.LatLngBounds();
        markersRef.current = regions.map((region, index) => {
          const isSelected = index === initialSelection();
          const marker = new maps.marker.AdvancedMarkerElement({
            map,
            position: positionOf(region),
            title: `${region.number}. ${region.name}`,
            gmpClickable: true,
            content: createPinElement(region, isSelected),
            zIndex: isSelected ? 10 : 1,
          });
          marker.addListener("click", () => select(index));
          bounds.extend(positionOf(region));
          return marker;
        });
        map.fitBounds(bounds, BOUNDS_PADDING);
        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => {
        if (!isCancelled) setStatus("failed");
      });

    return () => {
      isCancelled = true;
      for (const marker of markersRef.current) marker.map = null;
      markersRef.current = [];
      mapRef.current = null;
    };
  }, [config, regions]);

  // Keep the pins in step with the selection, wherever it came from.
  useEffect(() => {
    if (status !== "ready") return;
    markersRef.current.forEach((marker, index) => {
      const isSelected = index === selectedIndex;
      marker.content = createPinElement(regions[index], isSelected);
      marker.zIndex = isSelected ? 10 : 1;
    });
    const selected = regions[selectedIndex];
    const map = mapRef.current;
    if (!selected || !map) return;
    const position = positionOf(selected);
    if (!map.getBounds()?.contains(position)) map.panTo(position);
  }, [status, selectedIndex, regions]);

  if (status === "failed") {
    return (
      <>
        {fallback}
        <p role="status" className="border-t border-[#dde3d6] bg-white px-3.5 py-2.5 text-xs text-muted-foreground">
          Google Maps could not load, so this is our drawn map instead.
        </p>
      </>
    );
  }

  return (
    <div className="relative aspect-4/3 w-full sm:aspect-2/1 lg:aspect-auto lg:h-full lg:min-h-90">
      <div ref={containerRef} className="absolute inset-0" />
      {status === "loading" && (
        <p role="status" className="absolute inset-0 flex items-center justify-center text-caption font-semibold text-muted-foreground">
          Loading Google map…
        </p>
      )}
    </div>
  );
};

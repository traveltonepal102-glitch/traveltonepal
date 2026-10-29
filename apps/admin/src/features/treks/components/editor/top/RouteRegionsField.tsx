"use client";

import { Icon } from "@ttn/ui/icon";
import { useId } from "react";
import type { ChangeEvent } from "react";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { hintClass, inputClass, labelClass } from "@/components/ui/formStyles";
import { useRowList } from "@/hooks/useRowList";

import { MAX_ROUTE_REGIONS } from "../../../constants";
import type { RegionOption } from "../../../types";

type RouteRegionsFieldProps = {
  /** The main region ("" for a new trek) and the regions after it, in route order. */
  regionId: string;
  routeRegionIds: string[];
  regions: RegionOption[];
  errors: { regionId?: string; routeRegionIds?: string };
  onEdit: () => void;
};

/**
 * "Regions on the route", in order (e.g. Langtang → Ganesh Himal → Manaslu). The first is the main region (breadcrumb,
 * "Langtang local" guides); every region's page lists the trek. Sent as regionId (the first) and routeRegionId (the rest).
 */
export const RouteRegionsField = ({ regionId, routeRegionIds, regions, errors, onEdit }: RouteRegionsFieldProps) => {
  const selectId = useId();
  // A region deleted since the last save drops out here.
  const saved = [regionId, ...routeRegionIds].filter((id) => regions.some((region) => region.id === id));
  const list = useRowList(saved.map((id) => ({ regionId: id })), onEdit);
  const [main, ...rest] = list.rows;
  const available = regions.filter((region) => !list.rows.some((row) => row.regionId === region.id));
  const nameOf = (id: string) => regions.find((region) => region.id === id)?.name ?? "";

  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) list.add({ regionId: event.target.value });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>Regions on the route</span>
      <input type="hidden" name="regionId" value={main?.regionId ?? ""} />
      {rest.map((row) => (
        <input key={row.key} type="hidden" name="routeRegionId" value={row.regionId} />
      ))}
      {list.rows.length > 0 && (
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {list.rows.map((row, index) => {
            const name = nameOf(row.regionId);
            return (
              <li key={row.key} className="flex items-center gap-2.5 rounded-lg border border-solid border-border bg-page py-1.5 pr-1.5 pl-2.5">
                <span aria-hidden="true" className="inline-flex size-6 flex-none items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-bold text-ink">{name}</span>
                {index === 0 && <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">Main region</span>}
                <span className="flex gap-0.5">
                  <button type="button" className={ghostIconButton} aria-label={`Move ${name} earlier on the route`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
                    <Icon name="arrow_upward" size={18} />
                  </button>
                  <button type="button" className={ghostIconButton} aria-label={`Remove ${name}`} onClick={() => list.remove(row.key)}>
                    <Icon name="close" size={18} />
                  </button>
                </span>
              </li>
            );
          })}
        </ol>
      )}
      {list.rows.length <= MAX_ROUTE_REGIONS && available.length > 0 && (
        <>
          <label htmlFor={selectId} className="sr-only">
            {main ? "Add the next region on the route" : "Pick the main region"}
          </label>
          {/* Resets to the placeholder after each pick (value is always ""). */}
          <select id={selectId} value="" onChange={handleAdd} aria-describedby={`${selectId}-hint`} className={`${inputClass} cursor-pointer pr-8`}>
            <option value="">{main ? "Add the next region on the route…" : "Pick the main region…"}</option>
            {available.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </>
      )}
      <p id={`${selectId}-hint`} className={hintClass}>
        In the order the trek goes. The first is the main region, for the breadcrumb and the guides; every region&apos;s page lists the trek.
      </p>
      <FieldError id={`${selectId}-region-error`} message={errors.regionId} />
      <FieldError id={`${selectId}-route-error`} message={errors.routeRegionIds} />
    </div>
  );
};

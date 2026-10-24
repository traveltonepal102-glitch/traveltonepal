import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { STATUS_OPTIONS, difficultyOf, trekPath } from "../../constants";
import type { TrekListItem } from "../../lib/trekListItem";
import type { TrekStatus } from "../../types";

const STATUS_STYLES: Record<TrekStatus, { dot: string; text: string }> = {
  published: { dot: "bg-whatsapp", text: "text-whatsapp" },
  draft: { dot: "bg-saffron", text: "text-saffron-ink" },
  hidden: { dot: "bg-subtle", text: "text-muted-foreground" },
};

const statusLabel = (status: TrekStatus) => STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
const priceLabel = (price: number | null) => (price === null ? "Not set" : `$${price.toLocaleString("en")}`);

const Thumb = ({ trek, size }: { trek: TrekListItem; size: string }) => (
  <span className={cn("flex flex-none items-center justify-center overflow-hidden rounded-md bg-navy text-white/40", size)}>
    {trek.cover ? (
      <PhotoImage photo={trek.cover} alt="" sizes="84px" className="h-full w-full object-cover" />
    ) : (
      <Icon name="landscape" size={22} />
    )}
  </span>
);

const Difficulty = ({ trek }: { trek: TrekListItem }) => {
  const level = difficultyOf(trek.difficulty);
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", level.chip)}>{level.label}</span>;
};

const Status = ({ status }: { status: TrekStatus }) => (
  <span className={cn("inline-flex items-center gap-1.5 text-caption font-bold whitespace-nowrap", STATUS_STYLES[status].text)}>
    <span aria-hidden="true" className={cn("size-2 rounded-full", STATUS_STYLES[status].dot)} />
    {statusLabel(status)}
  </span>
);

const headClass = "border-b border-solid border-border bg-page px-4 py-2.5 text-left text-xs font-bold tracking-wider whitespace-nowrap text-muted-foreground uppercase";
const cellClass = "border-b border-solid border-border px-4 py-3 align-middle";

/** The treks as a table on wide screens and as cards on phones (design: Admin-treks). */
export const TrekTable = ({ treks }: { treks: TrekListItem[] }) => (
  <div className="overflow-hidden rounded-lg border border-solid border-border bg-surface">
    <table className="w-full border-collapse text-body-sm max-tablet:hidden">
      <thead>
        <tr>
          <th className={headClass}>Trek</th>
          <th className={cn(headClass, "text-right")}>Days</th>
          <th className={headClass}>Difficulty</th>
          <th className={cn(headClass, "text-right")}>From</th>
          <th className={headClass}>Status</th>
          <th className={headClass}>Edited (Nepal time)</th>
          <th className={headClass}>
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {treks.map((trek) => (
          <tr key={trek.id} className="hover:bg-page">
            <td className={cellClass}>
              <Link href={trekPath(trek.id)} className="flex items-center gap-3 text-ink no-underline hover:text-brand">
                <Thumb trek={trek} size="h-11.5 w-16" />
                <span>
                  <span className="block font-bold">{trek.name}</span>
                  <span className="block text-xs text-muted-foreground">{trek.regionName}</span>
                </span>
              </Link>
            </td>
            <td className={cn(cellClass, "text-right tabular-nums")}>{trek.days ?? "–"}</td>
            <td className={cellClass}>
              <Difficulty trek={trek} />
            </td>
            <td className={cn(cellClass, "text-right font-bold tabular-nums", trek.priceFromUsd === null && "font-semibold text-saffron-deep")}>
              {priceLabel(trek.priceFromUsd)}
            </td>
            <td className={cellClass}>
              <Status status={trek.status} />
            </td>
            <td className={cn(cellClass, "whitespace-nowrap text-muted-foreground")}>{trek.editedLabel}</td>
            <td className={cn(cellClass, "text-right")}>
              <Link href={trekPath(trek.id)} aria-label={`Edit ${trek.name}`} title="Edit" className={ghostIconButton}>
                <Icon name="edit" size={18} />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <ul className="m-0 hidden list-none flex-col p-0 max-tablet:flex">
      {treks.map((trek) => (
        <li key={trek.id} className="border-b border-solid border-border last:border-b-0">
          <Link href={trekPath(trek.id)} className="flex items-center gap-3 p-3 text-ink no-underline">
            <Thumb trek={trek} size="size-16" />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-bold">{trek.name}</span>
              <span className="text-xs text-muted-foreground">
                {trek.days ?? "–"} days · {difficultyOf(trek.difficulty).label} ·{" "}
                {trek.priceFromUsd === null ? "price not set" : `from ${priceLabel(trek.priceFromUsd)}`}
              </span>
              <Status status={trek.status} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

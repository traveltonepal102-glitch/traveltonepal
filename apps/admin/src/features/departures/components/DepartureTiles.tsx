import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

type DepartureTilesProps = {
  upcoming: number;
  guaranteed: number;
  almostFullOrFull: number;
  treksWithDates: number;
  trekCount: number;
};

/** The four numbers above the list (design: the tiles). */
export const DepartureTiles = ({ upcoming, guaranteed, almostFullOrFull, treksWithDates, trekCount }: DepartureTilesProps) => {
  const tiles: { icon: IconName; value: number; label: string; tone: string }[] = [
    { icon: "event", value: upcoming, label: "Upcoming dates", tone: "bg-brand-tint text-brand" },
    { icon: "verified", value: guaranteed, label: "Guaranteed", tone: "bg-green-tint text-whatsapp" },
    { icon: "hourglass_bottom", value: almostFullOrFull, label: "Almost full or full", tone: "bg-saffron-tint text-saffron-ink" },
    { icon: "landscape", value: treksWithDates, label: `Treks with dates (of ${trekCount})`, tone: "bg-muted text-text" },
  ];

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 desktop:grid-cols-4">
      {tiles.map((tile) => (
        <li key={tile.label} className="flex items-center gap-3 rounded-lg border border-solid border-border bg-surface p-4">
          <span className={`inline-flex size-10.5 flex-none items-center justify-center rounded-md ${tile.tone}`}>
            <Icon name={tile.icon} size={22} />
          </span>
          <span>
            <span className="block font-display text-2xl leading-none font-extrabold text-ink">{tile.value}</span>
            <span className="block text-caption text-muted-foreground">{tile.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

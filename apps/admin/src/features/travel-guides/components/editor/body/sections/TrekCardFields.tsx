import { Icon } from "@ttn/ui/icon";

import { SelectField } from "@/components/ui/SelectField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { difficultyOf } from "@/features/treks/constants";

import type { ArticleOptions } from "../../../../types";

type TrekCardFieldsProps = {
  trekId: string | null;
  treks: ArticleOptions["treks"];
  error?: string;
  onChange: (trekId: string | null) => void;
};

/** "10 days · Moderate · max 4,773 m · from $890", from the trek as saved. */
const trekLine = (trek: ArticleOptions["treks"][number]) =>
  [
    trek.days !== null && `${trek.days} days`,
    difficultyOf(trek.difficulty).label,
    trek.maxAltitudeM !== null && `max ${trek.maxAltitudeM.toLocaleString("en")} m`,
    trek.priceFromUsd !== null && `from $${trek.priceFromUsd.toLocaleString("en")}`,
  ]
    .filter(Boolean)
    .join(" · ");

/** "Trek card": a card that links to one of the treks. Its photo, days and price come from the trek. */
export const TrekCardFields = ({ trekId, treks, error, onChange }: TrekCardFieldsProps) => {
  const trek = treks.find((item) => item.id === trekId);

  return (
    <>
      <SelectField
        name="sectionTrekId"
        label="Trek"
        placeholder="Pick a trek"
        options={treks.map((item) => ({ value: item.id, label: item.name }))}
        defaultValue={trekId ?? ""}
        onValueChange={(value) => onChange(value || null)}
        error={error}
      />
      {trek && (
        <div className="flex flex-wrap items-center gap-3.5 rounded-lg border border-solid border-border bg-page p-2.5">
          <span className="flex h-20 w-30 flex-none items-center justify-center overflow-hidden rounded-md bg-navy text-white/40">
            {trek.cover ? <PhotoImage photo={trek.cover} alt="" sizes="120px" className="h-full w-full object-cover" /> : <Icon name="landscape" size={24} />}
          </span>
          <span className="min-w-40 flex-1">
            <span className="block font-display text-[17px] font-bold text-ink">{trek.name}</span>
            <span className="block text-caption text-muted-foreground">{trekLine(trek)}</span>
            <span className="mt-0.5 block text-xs font-semibold text-whatsapp">Photo, days and price update by themselves when the trek changes.</span>
          </span>
        </div>
      )}
    </>
  );
};

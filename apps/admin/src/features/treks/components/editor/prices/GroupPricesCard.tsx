"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { SourceNote } from "@/components/editor/SourceNote";
import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { pagePath } from "@/features/pages/constants";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { BOOKING_DEPOSIT_PERCENT, MAX_GROUP_PRICES, PRICE_LIMITS as LIMIT } from "../../../constants";
import type { GroupPrice } from "../../../types";

type GroupPricesCardProps = {
  prices: GroupPrice[];
  errors: FieldErrors;
  onEdit: () => void;
};

type PriceRow = Omit<GroupPrice, "priceUsd"> & { priceUsd: string };

const COLUMNS = "tablet:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,3fr)_118px_74px]";

const toRow = (price: GroupPrice): PriceRow => ({ ...price, priceUsd: price.priceUsd === null ? "" : String(price.priceUsd) });

/** Price per person by group size, with one "Most popular" row (design: "Price per person, by group size"). */
export const GroupPricesCard = ({ prices, errors, onEdit }: GroupPricesCardProps) => {
  const list = useRowList<PriceRow>(prices.map(toRow), onEdit);
  const rowError = (index: number, field: string) => errors[`groupPrices.${index}.${field}`];

  const addRow = () => list.add({ id: null, label: "", shortLabel: "", priceUsd: "", team: "", isDefault: list.rows.length === 0 });
  const makeDefault = (key: string) => list.updateAll((row) => ({ isDefault: row.key === key }));

  return (
    <FormSection
      title="Price per person, by group size"
      hint="Prices in US dollars. The trek is always private, so the price falls as the group grows. “Most popular” is selected first on the trek page and is the “From” price."
    >
      {list.rows.length > 0 && (
        <div aria-hidden="true" className={cn("hidden gap-2 px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase tablet:grid", COLUMNS)}>
          <span>Group size</span>
          <span>Short label</span>
          <span>Price (US$)</span>
          <span>Team that comes</span>
          <span>Most popular</span>
        </div>
      )}
      {list.rows.map((row, index) => {
        const number = index + 1;
        return (
          <div
            key={row.key}
            className={cn(
              "grid items-start gap-2 rounded-lg border border-solid p-2",
              COLUMNS,
              row.isDefault ? "border-brand/25 bg-brand-tint" : "border-transparent",
            )}
          >
            <input type="hidden" name="priceId" value={row.id ?? ""} />
            <input type="hidden" name="priceIsDefault" value={String(row.isDefault)} />
            <TextField name="priceLabel" label={`Group size, row ${number}`} isLabelHidden value={row.label} onValueChange={(label) => list.update(row.key, { label })} placeholder="3–5 people" maxLength={LIMIT.label} error={rowError(index, "label")} />
            <TextField name="priceShortLabel" label={`Short label, row ${number}`} isLabelHidden value={row.shortLabel} onValueChange={(shortLabel) => list.update(row.key, { shortLabel })} placeholder="3–5 Pax" maxLength={LIMIT.shortLabel} error={rowError(index, "shortLabel")} />
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-3 font-bold text-muted-foreground">$</span>
              <TextField name="priceUsd" label={`Price per person in US dollars, row ${number}`} isLabelHidden inputMode="numeric" value={row.priceUsd} onValueChange={(priceUsd) => list.update(row.key, { priceUsd })} placeholder="890" error={rowError(index, "priceUsd")} inputClassName="pl-7 font-bold" />
            </div>
            <TextField name="priceTeam" label={`Team that comes, row ${number}`} isLabelHidden value={row.team} onValueChange={(team) => list.update(row.key, { team })} placeholder="Lead guide + assistant + porters" maxLength={LIMIT.team} error={rowError(index, "team")} multiline rows={1} inputClassName="min-h-10.5 resize-none [field-sizing:content]" />
            <label className="flex h-10.5 cursor-pointer items-center gap-2 text-caption font-bold">
              <input type="radio" name="priceMostPopular" checked={row.isDefault} onChange={() => makeDefault(row.key)} className="size-4 accent-brand" />
              <span className={row.isDefault ? "text-brand" : "text-muted-foreground"}>{row.isDefault ? "Most popular" : "Set as popular"}</span>
            </label>
            <div className="flex gap-0.5 pt-1">
              <button type="button" className={ghostIconButton} aria-label={`Move row ${number} up`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
                <Icon name="arrow_upward" size={18} />
              </button>
              <button type="button" className={ghostIconButton} aria-label={`Remove row ${number}`} onClick={() => list.remove(row.key)}>
                <Icon name="delete" size={18} />
              </button>
            </div>
          </div>
        );
      })}
      <button type="button" onClick={addRow} disabled={list.rows.length >= MAX_GROUP_PRICES} className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}>
        <Icon name="add" size={16} />
        Add group size
      </button>
      <FieldError id="group-prices-error" message={errors.groupPrices} />
      <p className="m-0 flex items-start gap-2 rounded-md border border-solid border-border bg-page px-3 py-2.5 text-caption">
        <Icon name="info" size={18} className="flex-none text-brand" />
        <span>
          Deposit to confirm: <strong>{BOOKING_DEPOSIT_PERCENT}%</strong>. The deposit and the cancellation fees are the same for every trek.
        </span>
      </p>
      <SourceNote shownIn="the booking card" from={{ note: "The deposit is set by your developer." }} />
      <SourceNote shownIn="the Terms page (cancellation fees)" from={{ href: pagePath("legal"), label: "Pages › Legal pages" }} />
    </FormSection>
  );
};

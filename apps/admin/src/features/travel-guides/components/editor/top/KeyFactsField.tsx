"use client";

import { Menu } from "@base-ui/react/menu";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { ARTICLE_LIMITS as LIMIT, FACT_ICONS, MAX_FACTS } from "../../../constants";
import type { FactIcon, KeyFact } from "../../../types";

type KeyFactsFieldProps = {
  facts: KeyFact[];
  errors: FieldErrors;
  onEdit: () => void;
};

const TONES = { green: "bg-green-tint text-whatsapp", saffron: "bg-saffron-tint text-saffron-deep", brand: "bg-brand-tint text-brand", navy: "bg-navy/10 text-navy" } as const;
const toneOf = (icon: FactIcon) => TONES[FACT_ICONS.find((option) => option.value === icon)?.tone ?? "brand"];

/** "Key facts under the photo" (up to 4): an icon (picked from a menu), a label and a value. Sent as factIcon/Label/Value. */
export const KeyFactsField = ({ facts, errors, onEdit }: KeyFactsFieldProps) => {
  const list = useRowList(facts, onEdit);

  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>
        Key facts under the photo <span className="font-medium text-muted-foreground">(up to {MAX_FACTS})</span>
      </span>
      <ul className="m-0 grid list-none gap-2 p-0 tablet:grid-cols-2">
        {list.rows.map((fact, index) => {
          const number = index + 1;
          return (
            <li key={fact.key} className="flex items-center gap-2 rounded-lg border border-solid border-border bg-page p-2">
              <input type="hidden" name="factIcon" value={fact.icon} />
              <Menu.Root>
                <Menu.Trigger aria-label={`Change the icon of fact ${number}`} className={cn("inline-flex size-9 flex-none cursor-pointer items-center justify-center rounded-md border-0", toneOf(fact.icon))}>
                  <Icon name={fact.icon} size={18} />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner sideOffset={6} collisionPadding={12} className="z-100 outline-none">
                    <Menu.Popup className="grid grid-cols-4 gap-1 rounded-lg border border-solid border-border bg-surface p-2 shadow-popover outline-none">
                      {FACT_ICONS.map((option) => (
                        <Menu.Item
                          key={option.value}
                          onClick={() => list.update(fact.key, { icon: option.value })}
                          aria-label={option.label}
                          className={cn("inline-flex size-10 cursor-pointer items-center justify-center rounded-md outline-none data-highlighted:ring-2 data-highlighted:ring-brand", TONES[option.tone])}
                        >
                          <Icon name={option.value} size={20} />
                        </Menu.Item>
                      ))}
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <input
                  name="factLabel"
                  aria-label={`Fact ${number} label`}
                  defaultValue={fact.label}
                  placeholder="Best months"
                  maxLength={LIMIT.factLabel}
                  className={cn(inputClass, "h-7.5 text-xs font-bold text-muted-foreground")}
                />
                <input
                  name="factValue"
                  aria-label={`Fact ${number} value`}
                  defaultValue={fact.value}
                  placeholder="Oct–Nov, Mar–May"
                  maxLength={LIMIT.factValue}
                  aria-invalid={errors[`facts.${index}.value`] ? true : undefined}
                  className={cn(inputClass, "h-8 text-caption font-bold")}
                />
              </span>
              <button type="button" className={ghostIconButton} aria-label={`Remove fact ${number}`} onClick={() => list.remove(fact.key)}>
                <Icon name="close" size={16} />
              </button>
            </li>
          );
        })}
      </ul>
      <FieldError id="facts-error" message={Object.entries(errors).find(([field]) => field.startsWith("facts"))?.[1]} />
      <button
        type="button"
        onClick={() => list.add({ icon: FACT_ICONS[list.rows.length % FACT_ICONS.length]?.value ?? "wb_sunny", label: "", value: "" })}
        disabled={list.rows.length >= MAX_FACTS}
        className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add key fact
      </button>
      <span className="text-xs text-muted-foreground">Click an icon to change it.</span>
    </div>
  );
};

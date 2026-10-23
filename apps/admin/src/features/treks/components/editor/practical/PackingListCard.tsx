"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { PointListEditor } from "@/components/editor/PointListEditor";
import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_PACKING_GROUPS, MAX_PACKING_ITEMS, PACKING_ICONS, STARTER_PACKING_GROUPS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { PackingGroup } from "../../../types";

type PackingListCardProps = {
  intro: string;
  groups: PackingGroup[];
  errors: FieldErrors;
  onEdit: () => void;
};

const POINT_LIMITS = { title: LIMIT.pointTitle, text: LIMIT.pointText };

/**
 * "Gear and essentials" on the trek page: one line of intro and up to 6 cards of items. Each card's items are
 * sent as packingItem<card number>Title/Text, so the names follow the card's place in the list.
 */
export const PackingListCard = ({ intro, groups, errors, onEdit }: PackingListCardProps) => {
  const list = useRowList<PackingGroup>(groups, onEdit);
  const isFull = list.rows.length >= MAX_PACKING_GROUPS;

  return (
    <FormSection title="Packing list" hint="The trek page shows these cards under “Gear and essentials”. Each item is a bold lead-in and one line.">
      <TextField
        name="packingIntro"
        label="Line above the cards"
        defaultValue={intro}
        placeholder="Tested gear for the valley: −10 °C nights at Kyanjin to 25 °C days in the forest."
        maxLength={LIMIT.packingIntro}
        error={errors.packingIntro}
      />

      {list.rows.map((group, index) => {
        const number = index + 1;
        return (
          <div key={group.key} className="flex flex-col gap-3 rounded-xl border border-solid border-border bg-page p-3">
            <div className="grid items-start gap-2 tablet:grid-cols-[170px_minmax(0,1fr)_auto]">
              <SelectField name="packingGroupIcon" label={`Icon, card ${number}`} options={PACKING_ICONS} defaultValue={group.icon} error={errors[`packingGroups.${index}.icon`]} />
              <TextField
                name="packingGroupTitle"
                label={`Card ${number} title`}
                defaultValue={group.title}
                placeholder="Clothing and layering"
                maxLength={LIMIT.packingGroupTitle}
                error={errors[`packingGroups.${index}.title`]}
                inputClassName="font-bold"
              />
              <div className="flex gap-0.5 tablet:pt-6">
                <button type="button" className={ghostIconButton} aria-label={`Move card ${number} up`} disabled={index === 0} onClick={() => list.move(index, index - 1)}>
                  <Icon name="arrow_upward" size={18} />
                </button>
                <button type="button" className={ghostIconButton} aria-label={`Remove card ${number}`} onClick={() => list.remove(group.key)}>
                  <Icon name="delete" size={18} />
                </button>
              </div>
            </div>
            <PointListEditor
              prefix={`packingItem${index}`}
              field={`packingGroups.${index}.items`}
              itemLabel="Item"
              points={group.items}
              maxItems={MAX_PACKING_ITEMS}
              limits={POINT_LIMITS}
              placeholders={{ title: "e.g. Down jacket", text: "e.g. rated to about −10 °C for evenings at Kyanjin." }}
              errors={errors}
              onEdit={onEdit}
              layout="rows"
            />
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => list.add({ title: "", icon: "backpack", items: [] })}
          disabled={isFull}
          className={cn(secondaryButton, "min-h-8 px-3 text-caption")}
        >
          <Icon name="add" size={16} />
          Add card
        </button>
        {!list.rows.length && (
          <button type="button" onClick={() => STARTER_PACKING_GROUPS.forEach(list.add)} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
            <Icon name="checklist" size={16} />
            Start with the usual 4 cards
          </button>
        )}
      </div>
      <FieldError id="packing-groups-error" message={errors.packingGroups} />
    </FormSection>
  );
};

"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import type { ReactNode } from "react";

import { PointListEditor } from "@/components/editor/PointListEditor";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_INCLUDED_ITEMS, MAX_MEAL_TIPS, TREK_LIMITS as LIMIT } from "../../constants";
import type { TrekValues } from "../../types";

type TrekIncludedSectionProps = {
  values: TrekValues;
  errors: FieldErrors;
  onEdit: () => void;
};

const POINT_LIMITS = { title: LIMIT.pointTitle, text: LIMIT.pointText };

const numberText = (value: number | null) => (value === null ? "" : String(value));

/** A list's heading with its icon, as on the trek page (green tick for covered, red cross for not). */
const ListHeading = ({ icon, tone, children }: { icon: IconName; tone: "green" | "red"; children: ReactNode }) => (
  <p className={cn("m-0 flex items-center gap-2 font-bold", tone === "green" ? "text-whatsapp" : "text-danger")}>
    <Icon name={icon} size={20} />
    {children}
  </p>
);

/** What's covered, what's not, and the meals box (design: section "included"; data: the trek page). */
export const TrekIncludedSection = ({ values, errors, onEdit }: TrekIncludedSectionProps) => (
  <>
    <FormSection title="What the price includes" hint="Each item is a bold lead-in and one line, e.g. “Permits: Langtang National Park permit and TIMS card.”">
      <ListHeading icon="check_circle" tone="green">
        What’s covered
      </ListHeading>
      <PointListEditor
        prefix="included"
        field="included"
        itemLabel="Included item"
        points={values.included}
        maxItems={MAX_INCLUDED_ITEMS}
        limits={POINT_LIMITS}
        placeholders={{ title: "e.g. Permits", text: "e.g. Langtang National Park permit and TIMS card." }}
        errors={errors}
        onEdit={onEdit}
        layout="rows"
      />
    </FormSection>

    <FormSection title="What is not included" hint="Being clear here avoids surprises (and questions on WhatsApp).">
      <ListHeading icon="close" tone="red">
        What’s not included
      </ListHeading>
      <PointListEditor
        prefix="excluded"
        field="excluded"
        itemLabel="Not included item"
        points={values.excluded}
        maxItems={MAX_INCLUDED_ITEMS}
        limits={POINT_LIMITS}
        placeholders={{ title: "e.g. Travel insurance", text: "e.g. required, with helicopter rescue cover." }}
        errors={errors}
        onEdit={onEdit}
        layout="rows"
      />
    </FormSection>

    <FormSection title="Meals on the trail" hint="Meals aren't in the price: trekkers order from teahouse menus. The trek page explains why and what it costs.">
      <div className="grid max-w-105 grid-cols-2 gap-3">
        <TextField
          name="mealBudgetMinUsd"
          label="Food a day, from (US$)"
          inputMode="numeric"
          placeholder="20"
          defaultValue={numberText(values.mealBudgetMinUsd)}
          error={errors.mealBudgetMinUsd}
        />
        <TextField
          name="mealBudgetMaxUsd"
          label="to (US$)"
          inputMode="numeric"
          placeholder="30"
          defaultValue={numberText(values.mealBudgetMaxUsd)}
          error={errors.mealBudgetMaxUsd}
        />
      </div>
      <ListHeading icon="lightbulb" tone="green">
        Tips for eating on the trail
      </ListHeading>
      <PointListEditor
        prefix="mealTip"
        field="mealTrailTips"
        itemLabel="Tip"
        points={values.mealTrailTips}
        maxItems={MAX_MEAL_TIPS}
        limits={POINT_LIMITS}
        placeholders={{ title: "e.g. Stay hydrated", text: "e.g. drink 3–4 litres a day (ginger-lemon-honey tea, boiled water)." }}
        errors={errors}
        onEdit={onEdit}
        layout="rows"
      />
      <ListHeading icon="cottage" tone="green">
        Teahouse notes
      </ListHeading>
      <PointListEditor
        prefix="teahouseNote"
        field="mealTeahouseNotes"
        itemLabel="Note"
        points={values.mealTeahouseNotes}
        maxItems={MAX_MEAL_TIPS}
        limits={POINT_LIMITS}
        placeholders={{ title: "e.g. Order early", text: "e.g. order dinner around 5 pm and choose your breakfast time the night before." }}
        errors={errors}
        onEdit={onEdit}
        layout="rows"
      />
    </FormSection>
  </>
);

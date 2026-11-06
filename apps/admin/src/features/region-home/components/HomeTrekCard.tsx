import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { NEW_TREK_PATH, STATUS_OPTIONS, trekPath } from "@/features/treks/constants";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { HomeTrekOption } from "../types";

type HomeTrekCardProps = {
  treks: HomeTrekOption[];
  homeTrekId: string | null;
  errors: FieldErrors;
};

const statusLabel = (status: HomeTrekOption["status"]) => STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;

/**
 * "Main trek": the website's trek the Home page shows in full, in the order of its page sections (set in the trek
 * editor). It has no page of its own: its address leads to the Home page.
 */
export const HomeTrekCard = ({ treks, homeTrekId, errors }: HomeTrekCardProps) => {
  const chosen = treks.find((trek) => trek.id === homeTrekId);

  return (
    <FormSection title="Main trek" hint="The Home page shows this trek in full: its days, prices, photos and questions, in its own section order." aside={<span className="text-xs text-muted-foreground">Fills the page</span>}>
      {treks.length === 0 ? (
        <p className="m-0 flex flex-wrap items-center gap-2 rounded-md bg-saffron-tint px-3.5 py-3 text-caption text-saffron-ink">
          <Icon name="info" size={18} className="flex-none" />
          This website has no treks yet.
          <Link href={NEW_TREK_PATH} className="font-bold text-brand">
            Add its first trek
          </Link>
          <input type="hidden" name="homeTrekId" value="" />
        </p>
      ) : (
        <>
          <SelectField
            name="homeTrekId"
            label="Trek shown on the Home page"
            options={[{ value: "", label: "No main trek yet" }, ...treks.map((trek) => ({ value: trek.id, label: trek.status === "published" ? trek.name : `${trek.name} (${statusLabel(trek.status)})` }))]}
            defaultValue={homeTrekId ?? ""}
            hint="Only a published trek shows on the website. Its own address leads to the Home page, so Google sees it once."
            error={errors.homeTrekId}
          />
          {chosen && (
            <Link href={trekPath(chosen.id)} className="inline-flex items-center gap-1.5 self-start text-caption font-bold text-brand">
              <Icon name="open_in_new" size={16} />
              Edit {chosen.name}: its sections and their order
            </Link>
          )}
        </>
      )}
    </FormSection>
  );
};

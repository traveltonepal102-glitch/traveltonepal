import { Icon } from "@ttn/ui/icon";

import { TextField } from "@/components/ui/TextField";
import { googleMapsUrl } from "@/features/treks/lib/googleMaps";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type MapFieldsProps = {
  title: string;
  place: string;
  /** e.g. "sections.7" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { title?: string; place?: string }) => void;
};

/** "Map": a Google map of a place, loaded only after a click on the website (privacy rules). */
export const MapFields = ({ title, place, field, errors, onChange }: MapFieldsProps) => (
  <div className="grid gap-3 tablet:grid-cols-2">
    <TextField name="sectionMapTitle" label="Title" labelNote="(optional)" value={title} onValueChange={(next) => onChange({ title: next })} placeholder="Syabrubesi trailhead" maxLength={LIMIT.mapTitle} error={errors[`${field}.title`]} />
    <div className="flex flex-col gap-1.5">
      <TextField
        name="sectionMapPlace"
        label="Place the map shows"
        hint="Write it as you would search for it on Google Maps."
        value={place}
        onValueChange={(next) => onChange({ place: next })}
        placeholder="Syabrubesi, Rasuwa, Nepal"
        maxLength={LIMIT.mapPlace}
        error={errors[`${field}.place`]}
      />
      {place.trim() && (
        <a href={googleMapsUrl({ place, myMapsId: null })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 self-start text-caption font-bold text-brand">
          <Icon name="open_in_new" size={16} />
          Check on Google Maps
        </a>
      )}
    </div>
  </div>
);

import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { COMPARE_TREKS } from "../../../../sectionKinds";
import { ToggleChipsField } from "../pickers/ToggleChipsField";

type CompareTreksFieldsProps = {
  trekIds: string[];
  treks: SectionContext["treks"];
  /** e.g. "sections.4" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (trekIds: string[]) => void;
};

const ROWS = [
  { label: "Days", value: (trek: SectionContext["treks"][number]) => (trek.days === null ? "—" : String(trek.days)) },
  { label: "Highest", value: (trek: SectionContext["treks"][number]) => (trek.maxAltitudeM === null ? "—" : `${trek.maxAltitudeM.toLocaleString("en")} m`) },
  { label: "From", value: (trek: SectionContext["treks"][number]) => (trek.priceFromUsd === null ? "—" : `$${trek.priceFromUsd.toLocaleString("en")}`) },
];

/** "Compare treks": 2 or 3 treks side by side; days, highest point and price come from the treks. */
export const CompareTreksFields = ({ trekIds, treks, field, errors, onChange }: CompareTreksFieldsProps) => {
  const picked = trekIds.flatMap((id) => treks.filter((trek) => trek.id === id));
  return (
    <>
      <ToggleChipsField
        label="Treks"
        field={`${field}.trekIds`}
        options={treks.map((trek) => ({ value: trek.id, label: trek.name }))}
        values={trekIds}
        max={COMPARE_TREKS.max}
        hint={`Pick ${COMPARE_TREKS.min} or ${COMPARE_TREKS.max}, in the order they show.`}
        error={errors[`${field}.trekIds`]}
        onChange={onChange}
      />
      {picked.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-solid border-border">
          <table className="w-full border-collapse text-caption">
            <thead>
              <tr className="bg-page">
                <th className="p-2 text-left" scope="col">
                  <span className="sr-only">Fact</span>
                </th>
                {picked.map((trek) => (
                  <th key={trek.id} className="p-2 text-left font-bold text-ink" scope="col">
                    {trek.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-solid border-border">
                  <th className="p-2 text-left font-semibold text-muted-foreground" scope="row">
                    {row.label}
                  </th>
                  {picked.map((trek) => (
                    <td key={trek.id} className="p-2 text-ink">
                      {row.value(trek)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

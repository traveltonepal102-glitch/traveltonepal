import { cn } from "@ttn/ui/lib/utils";

import { FormGroup } from "@/components/editor/FormGroup";
import { Switch } from "@/components/ui/Switch";

import type { AuthorKind, AuthorValues } from "../../types";

type AuthorVisibilityFieldsProps = {
  values: AuthorValues;
  kind: AuthorKind;
};

/** "Where this person appears": the author box under articles, and the About page (office team only). */
export const AuthorVisibilityFields = ({ values, kind }: AuthorVisibilityFieldsProps) => {
  const isOffice = kind === "office";
  const switches = [
    { name: "showAuthorBox", label: "Show the author box under articles", sub: "Photo, name, short bio and “More guides by…”", isOn: values.showAuthorBox, isLocked: false },
    {
      name: "showOnAbout",
      label: "Also on the About page",
      sub: isOffice ? "In “Our guides and team”" : kind === "guide" ? "Set for guides in Trekking guides" : "Only for office team",
      isOn: values.showOnAbout,
      isLocked: !isOffice,
    },
  ];

  return (
    <FormGroup title="Where this person appears">
      {switches.map((item) => (
        <label
          // A new switch when the kind changes, so a locked one shows off (it isn't sent, so it saves off).
          key={`${item.name}-${kind}`}
          className={cn("flex items-center gap-3 rounded-lg border border-solid border-border p-3", item.isLocked ? "cursor-not-allowed" : "cursor-pointer hover:border-line-strong")}
        >
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-ink">{item.label}</span>
            <span className="block text-xs text-muted-foreground">{item.sub}</span>
          </span>
          <Switch name={item.name} label={item.label} defaultChecked={item.isOn && !item.isLocked} disabled={item.isLocked} />
        </label>
      ))}
    </FormGroup>
  );
};

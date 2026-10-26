import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutPageValues, AboutTeamPerson } from "../../types";
import { SectionHeadingFields } from "../SectionHeadingFields";

const GROUPS = [
  { key: "office", title: "Office team", from: "Authors" },
  { key: "guides", title: "Trekking guides", from: "Trekking guides" },
] as const;

/**
 * "Our guides and team", read-only: who shows, and why someone doesn't. People are added and switched on or off where
 * they live (Authors, Trekking guides), never typed again here.
 */
type AboutTeamCardProps = { values: AboutPageValues; people: AboutTeamPerson[]; errors: FieldErrors };

export const AboutTeamCard = ({ values, people, errors }: AboutTeamCardProps) => (
  <FormSection title="The people" hint="Office team from Authors, guides from Trekking guides: switch “Show on the About page” there. Each person needs a photo and their OK to show it. Open a person to change them.">
    <SectionHeadingFields
      eyebrow="Our guides and team"
      heading={{ name: "teamHeading", value: values.teamHeading, placeholder: "The people who plan and lead your trek" }}
      intro={{ name: "teamIntro", value: values.teamIntro, placeholder: "Licensed guides from each region, and a small Kathmandu office that answers your messages." }}
      errors={errors}
    />
    {GROUPS.map((group) => {
      const members = people.filter((person) => person.group === group.key);
      return (
        <div key={group.key} className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            {group.title} · {members.filter((person) => person.isShown).length} shown
          </span>
          {members.length ? (
            <ul className="m-0 grid list-none gap-1.5 p-0 tablet:grid-cols-2">
              {members.map((person) => (
                <li key={person.id}>
                  <Link href={person.href} className="flex items-center gap-2.5 rounded-md border border-solid border-border bg-surface px-3 py-2 no-underline hover:border-brand">
                    <Icon name={person.isShown ? "check_circle" : "visibility_off"} size={18} className={cn("flex-none", person.isShown ? "text-whatsapp" : "text-subtle")} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-ink">{person.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{person.note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-caption text-muted-foreground">No one yet. Add them in {group.from}.</p>
          )}
        </div>
      );
    })}
  </FormSection>
);

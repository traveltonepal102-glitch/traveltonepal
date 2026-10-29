import { EMBED_HEIGHTS, EMBED_PROVIDERS, toEmbed } from "@ttn/config/embeds";
import type { EmbedHeight } from "@ttn/config/embeds";
import { Icon } from "@ttn/ui/icon";

import { labelClass } from "@/components/ui/formStyles";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type EmbedFieldsProps = {
  /** The pasted code or link (or the saved address); only the address is saved. */
  code: string;
  height: EmbedHeight;
  title: string;
  caption: string;
  /** e.g. "sections.8" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { code?: string; height?: EmbedHeight; title?: string; caption?: string }) => void;
};

const HEIGHTS: { value: EmbedHeight; label: string }[] = [
  { value: "short", label: `Short (${EMBED_HEIGHTS.short} px)` },
  { value: "medium", label: `Medium (${EMBED_HEIGHTS.medium} px)` },
  { value: "tall", label: `Tall (${EMBED_HEIGHTS.tall} px)` },
];

const SERVICES = EMBED_PROVIDERS.map((provider) => provider.name).join(", ");

/** "Embed": a map or video from an allowed service, loaded on the website only after a click (privacy rules). */
export const EmbedFields = ({ code, height, title, caption, field, errors, onChange }: EmbedFieldsProps) => {
  const embed = toEmbed(code);
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <TextField
          name="sectionEmbedCode"
          label="Embed code or link"
          hint={`From ${SERVICES}: use the service’s Share › Embed and copy the code. A Google My Maps or Vimeo link works too.`}
          multiline
          rows={3}
          value={code}
          onValueChange={(next) => onChange({ code: next })}
          placeholder={'<iframe src="https://www.google.com/maps/d/embed?mid=…" width="640" height="480"></iframe>'}
          maxLength={LIMIT.embedCode}
          error={errors[`${field}.code`]}
          inputClassName="font-mono text-caption"
        />
        {embed && (
          <p className="m-0 inline-flex items-center gap-1.5 text-caption font-semibold text-whatsapp">
            <Icon name="check_circle" size={16} />
            {embed.provider.name} {embed.provider.kind}: visitors load it with a click, or once they allow external media.
          </p>
        )}
      </div>
      <div className="grid gap-3 tablet:grid-cols-2">
        <TextField name="sectionEmbedTitle" label="Title" hint="Names it for screen readers." value={title} onValueChange={(next) => onChange({ title: next })} placeholder="Langtang Valley route" maxLength={LIMIT.embedTitle} error={errors[`${field}.title`]} />
        <TextField name="sectionEmbedCaption" label="Caption" labelNote="(optional)" value={caption} onValueChange={(next) => onChange({ caption: next })} placeholder="Our route, with every teahouse stop" maxLength={LIMIT.caption} error={errors[`${field}.caption`]} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Height on the website</span>
        <SegmentedControl label="Height on the website" options={HEIGHTS} value={height} onChange={(next) => onChange({ height: next })} />
      </div>
    </>
  );
};

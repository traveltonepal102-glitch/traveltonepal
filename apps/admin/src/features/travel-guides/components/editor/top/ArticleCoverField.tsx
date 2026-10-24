"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { PhotoUploadButton } from "@/features/photos/components/PhotoUploadButton";
import { UploadProgressList } from "@/features/photos/components/UploadProgressList";
import { usePhotoUploads } from "@/features/photos/hooks/usePhotoUploads";
import type { Photo } from "@/features/photos/types";

type ArticleCoverFieldProps = {
  cover: Photo | null;
  /** New uploads are tagged with the guide's website region (null: the main site). */
  regionId: string | null;
  /** The tags over the photo, as the page shows them; `isAuto` ones fill in by themselves (dashed border). */
  tags: { label: string; tone: "trek" | "auto" | "highlight" }[];
  error?: string;
  onChange: (cover: Photo | null) => void;
};

const TAG_STYLES = {
  trek: "bg-saffron text-navy",
  auto: "border border-dashed border-white/50 bg-white/15 text-white",
  highlight: "bg-whatsapp/95 text-white",
} as const;

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/**
 * The photo at the top of the guide (design: "Top of the page"), with its tags as on the website. Uploads go
 * to the photo library right away (location data removed); the photo is sent with Save as coverPhotoId.
 */
export const ArticleCoverField = ({ cover, regionId, tags, error, onChange }: ArticleCoverFieldProps) => {
  const uploads = usePhotoUploads<"cover">({ regionId, onUploaded: (photo) => onChange(photo) });

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="coverPhotoId" value={cover?.id ?? ""} />
      <div className="relative aspect-21/8 overflow-hidden rounded-xl bg-navy max-tablet:aspect-16/9">
        {cover ? (
          <PhotoImage photo={cover} alt="" sizes="(min-width: 1200px) 760px, 100vw" className="h-full w-full object-cover opacity-85" />
        ) : (
          <span className="flex h-full items-center justify-center text-white/50">
            <Icon name="add_photo_alternate" size={40} />
          </span>
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/0 from-30% to-navy/80" />
        <span className="absolute right-4 bottom-3.5 left-4 flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <span key={`${tag.tone}-${tag.label}`} className={cn("rounded-md px-2.5 py-1 text-xs font-bold", TAG_STYLES[tag.tone])}>
              {tag.label}
            </span>
          ))}
        </span>
        <span className="absolute top-3 right-3 flex gap-2">
          <PhotoUploadButton label={cover ? "Change photo" : "Add photo"} isDisabled={uploads.isUploading} onFiles={(files) => uploads.upload(files.slice(0, 1), "cover")} />
          {cover && (
            <button type="button" onClick={() => onChange(null)} className={smallButton}>
              <Icon name="delete" size={16} />
              Remove
            </button>
          )}
        </span>
      </div>
      <UploadProgressList items={uploads.items} onDismiss={uploads.dismiss} />
      <span className="text-xs text-muted-foreground">Tags with a dashed border fill in by themselves: the topic and the main trek’s highest point.</span>
      <FieldError id="cover-photo-error" message={error} />
    </div>
  );
};

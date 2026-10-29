import Link from "next/link";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import type { RemoveBlockerGroup } from "@/components/editor/types";
import { formatDateTime } from "@/utils/formatDateTime";

import { deletePhoto } from "../actions/deletePhoto";
import { formatFileSize } from "../lib/formatFileSize";
import { folderOfUse } from "../lib/photoFolders";
import { photoUseHref, photoUseLabel } from "../lib/photoUseLinks";
import type { LibraryPhoto, PhotoUse } from "../types";
import { PhotoImage } from "./PhotoImage";

type LibraryPhotoCardProps = { photo: LibraryPhoto; uses: readonly PhotoUse[]; canDelete: boolean };

/** Uses listed on the card; the rest are counted ("+3 more"). */
const SHOWN_USES = 4;

const keyOfUse = (use: PhotoUse) => `${use.kind}-${use.itemId}-${use.detail}`;

/** What still uses the photo, by folder, for the delete window (it lists them instead of deleting). */
const blockersOf = (uses: readonly PhotoUse[]): RemoveBlockerGroup[] => {
  const groups = new Map<string, PhotoUse[]>();
  for (const use of uses) {
    const label = folderOfUse(use.kind)?.label ?? "Other";
    groups.set(label, [...(groups.get(label) ?? []), use]);
  }
  return [...groups.entries()].map(([label, groupUses]) => ({
    label: `Used in ${label}`,
    fix: "Choose another photo there, or take this one off.",
    items: groupUses.map((use) => ({ id: keyOfUse(use), name: photoUseLabel(use), href: photoUseHref(use) })),
  }));
};

/** One library photo: the picture, its file, where it is used (each a link to change it) and Delete. */
export const LibraryPhotoCard = ({ photo, uses, canDelete }: LibraryPhotoCardProps) => {
  const name = photo.originalName || "Untitled photo";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-solid border-border bg-surface">
      <div className="aspect-4/3 bg-page">
        <PhotoImage photo={photo} alt="" sizes="(min-width: 1101px) 300px, (min-width: 701px) 45vw, 100vw" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="min-w-0">
          <p className="m-0 truncate text-caption font-bold text-ink" title={name}>
            {name}
          </p>
          <p className="m-0 mt-0.5 text-xs text-muted-foreground">
            {photo.width} × {photo.height} · {formatFileSize(photo.byteSize)} · {formatDateTime(photo.createdAt)}
            {photo.place && ` · ${photo.place}`}
          </p>
        </div>

        {uses.length > 0 ? (
          <ul aria-label="Used in" className="m-0 flex list-none flex-col gap-1 p-0">
            {uses.slice(0, SHOWN_USES).map((use) => (
              <li key={keyOfUse(use)} className="min-w-0">
                <Link href={photoUseHref(use)} className="block truncate text-xs font-semibold text-brand hover:underline">
                  {photoUseLabel(use)}
                </Link>
              </li>
            ))}
            {uses.length > SHOWN_USES && <li className="text-xs text-muted-foreground">+{uses.length - SHOWN_USES} more</li>}
          </ul>
        ) : (
          <p className="m-0 self-start rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">Not used yet</p>
        )}

        {canDelete && (
          <div className="mt-auto flex justify-end pt-1">
            <ConfirmRemoveButton
              name={`“${name}”`}
              verb="delete"
              consequence="The photo and all its sizes are removed from storage."
              action={deletePhoto.bind(null, photo.id)}
              blockers={blockersOf(uses)}
            />
          </div>
        )}
      </div>
    </article>
  );
};

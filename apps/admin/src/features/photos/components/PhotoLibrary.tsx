import { isTimeFolder, photoFolderHref } from "../lib/photoFolders";
import type { FolderSelection, PhotoFolder } from "../lib/photoFolders";
import { groupByUploadTime } from "../lib/uploadTimeGroups";
import type { LibraryPhoto, PhotoUse } from "../types";
import { LibraryFolderNav } from "./LibraryFolderNav";
import { LibraryPhotoCard } from "./LibraryPhotoCard";
import { LibraryUploadButton } from "./LibraryUploadButton";
import { MediaLibraryHeader } from "./MediaLibraryHeader";

type PhotoLibraryProps = {
  folders: readonly PhotoFolder[];
  selection: FolderSelection;
  /** The photos in the open folder. */
  photos: readonly LibraryPhoto[];
  usesByPhoto: ReadonlyMap<string, readonly PhotoUse[]>;
  canDelete: boolean;
  /** When the page was made, for "Today", "Yesterday"… */
  now: Date;
};

type PhotoGridProps = Pick<PhotoLibraryProps, "photos" | "usesByPhoto" | "canDelete">;

const PhotoGrid = ({ photos, usesByPhoto, canDelete }: PhotoGridProps) => (
  <ul className="m-0 grid list-none gap-3.5 p-0 tablet:grid-cols-2 desktop:grid-cols-3 min-[1500px]:grid-cols-4">
    {photos.map((photo) => (
      <li key={photo.id}>
        <LibraryPhotoCard photo={photo} uses={usesByPhoto.get(photo.id) ?? []} canDelete={canDelete} />
      </li>
    ))}
  </ul>
);

/** "Treks › Mardi Himal Trek" */
const folderTitle = (folders: readonly PhotoFolder[], { folder, item }: FolderSelection) => {
  const open = folders.find((entry) => entry.key === folder);
  const openItem = open?.items.find((entry) => entry.id === item);
  return openItem ? `${open?.label} › ${openItem.label}` : (open?.label ?? "All photos");
};

/** The Photos tab of Photos and videos: every library photo in folders by where it is used, to upload, find and delete photos. */
export const PhotoLibrary = ({ folders, selection, photos, usesByPhoto, canDelete, now }: PhotoLibraryProps) => (
  <>
    <MediaLibraryHeader
      tab="photos"
      description={
        <>
          Every photo in the library ({folders[0]?.count ?? 0}), sorted into folders by where it is used. Click where a photo is used to change it there. A
          photo can be deleted once nothing uses it{canDelete ? "" : " (by a Super admin)"}. Location data is removed from every upload.
        </>
      }
      action={<LibraryUploadButton />}
    />

    <div className="grid items-start gap-5 desktop:grid-cols-[240px_minmax(0,1fr)]">
      <LibraryFolderNav label="Photo folders" folders={folders} selection={selection} hrefOf={photoFolderHref} />
      <section aria-labelledby="photo-folder-title" className="flex min-w-0 flex-col gap-3">
        <h2 id="photo-folder-title" className="m-0 font-display text-h4 text-ink">
          {folderTitle(folders, selection)} <span className="font-sans text-caption font-bold text-muted-foreground">({photos.length})</span>
        </h2>
        {photos.length > 0 && !isTimeFolder(selection.folder) && <PhotoGrid photos={photos} usesByPhoto={usesByPhoto} canDelete={canDelete} />}
        {photos.length > 0 &&
          isTimeFolder(selection.folder) &&
          groupByUploadTime(photos, now).map((group) => (
            <section key={group.label} aria-label={`Uploaded ${group.label}`} className="flex flex-col gap-2.5">
              <h3 className="m-0 flex items-center gap-2 border-0 border-b border-solid border-border pb-1.5 text-caption font-bold tracking-wide text-muted-foreground uppercase">
                {group.label}
                <span className="font-semibold normal-case">({group.photos.length})</span>
              </h3>
              <PhotoGrid photos={group.photos} usesByPhoto={usesByPhoto} canDelete={canDelete} />
            </section>
          ))}
        {photos.length === 0 && (
          <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground">
            {selection.folder === "recent" ? "Nothing uploaded in the last 30 days." : "No photos in this folder."}
          </p>
        )}
      </section>
    </div>
  </>
);

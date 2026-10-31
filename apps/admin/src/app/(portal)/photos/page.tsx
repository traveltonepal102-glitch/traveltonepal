import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { PhotoLibrary } from "@/features/photos/components/PhotoLibrary";
import { buildPhotoFolders, parseFolderSelection, photosInFolder, usesByPhoto } from "@/features/photos/lib/photoFolders";
import { listAllPhotos, listPhotoUses } from "@/features/photos/services/photoLibraryRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const metadata: Metadata = { title: ADMIN_SECTIONS.photos.label };

/** Photos and videos › Photos: the library in folders by where each photo is used. "?folder=treks&item=<trek id>" opens a folder. */
const PhotosPage = async ({ searchParams }: PageProps<"/photos">) => {
  const admin = await requireAdmin();
  const [photos, uses, params] = await Promise.all([listAllPhotos(), listPhotoUses(), searchParams]);
  const selection = parseFolderSelection(params);
  const now = new Date();

  return (
    <PhotoLibrary
      folders={buildPhotoFolders(photos, uses, now)}
      selection={selection}
      photos={photosInFolder(photos, uses, selection, now)}
      usesByPhoto={usesByPhoto(uses)}
      canDelete={admin.role === "super_admin"}
      now={now}
    />
  );
};

export default PhotosPage;

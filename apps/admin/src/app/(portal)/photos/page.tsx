import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { PhotoLibrary } from "@/features/photos/components/PhotoLibrary";
import { buildPhotoFolders, parseFolderSelection, photosInFolder, usesByPhoto } from "@/features/photos/lib/photoFolders";
import { listAllPhotos, listPhotoUses } from "@/features/photos/services/photoLibraryRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";

export const metadata: Metadata = { title: ADMIN_SECTIONS.photos.label };

/** Photos and videos › Photos: the library of the website "Working on" shows (each website has its own), in folders by where each photo is used. "?folder=treks&item=<trek id>" opens a folder. */
const PhotosPage = async ({ searchParams }: PageProps<"/photos">) => {
  const admin = await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const [photos, uses, params] = await Promise.all([listAllPhotos(site.id), listPhotoUses(), searchParams]);
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

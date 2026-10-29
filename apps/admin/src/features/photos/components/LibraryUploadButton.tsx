"use client";

import { useRouter } from "next/navigation";

import { usePhotoUploads } from "../hooks/usePhotoUploads";
import { PhotoUploadButton } from "./PhotoUploadButton";
import { UploadProgressList } from "./UploadProgressList";

/** "Upload photos" straight into the library (no region); each finished photo shows up under "Not used yet". */
export const LibraryUploadButton = () => {
  const router = useRouter();
  const { items, upload, dismiss, isUploading } = usePhotoUploads<null>({ regionId: null, onUploaded: () => router.refresh() });

  return (
    <div className="flex flex-col items-end gap-2">
      <PhotoUploadButton label={isUploading ? "Uploading…" : "Upload photos"} isMultiple isDisabled={isUploading} onFiles={(files) => upload(files, null)} />
      <div className="w-full max-w-90">
        <UploadProgressList items={items} onDismiss={dismiss} />
      </div>
    </div>
  );
};

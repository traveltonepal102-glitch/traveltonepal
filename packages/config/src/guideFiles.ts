/**
 * A travel guide's "File to download" section: a PDF in the public trek-files storage, at
 * guide-files/<uuid>/<name>.pdf. The name comes from the uploaded file ("Langtang packing list.pdf" →
 * "langtang-packing-list"), so the download keeps a readable name; the id folder keeps addresses unique.
 * The admin checks the address when it saves, the website again before it links to it.
 */
export const GUIDE_FILE_PATH = /^guide-files\/[0-9a-f-]{36}\/[a-z0-9]+(-[a-z0-9]+)*\.pdf$/;

/** The storage's own limit (15 MB). */
export const MAX_GUIDE_FILE_BYTES = 15 * 1024 * 1024;

/** "1.2 MB", "850 KB": a file's size for people. */
export const fileSizeLabel = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

/** 703200 → "687 KB", 2_400_000 → "2.3 MB" (the size of the file as uploaded). */
export const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

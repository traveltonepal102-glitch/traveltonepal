import type { SiteLanguage } from "./siteLanguage";

/** What a guide file is, for its icon and the words beside it. */
export type GuideFileCategory = "pdf" | "document" | "spreadsheet" | "presentation" | "image" | "audio" | "archive";

export type GuideFileFormat = {
  /** The file ending, lower case, without the dot. */
  extension: string;
  /** The type it is stored and served with (the upload link is signed for it). */
  contentType: string;
  /** Shown to visitors and editors: "PDF", "XLSX". */
  label: string;
  category: GuideFileCategory;
  /** Browsers show it in a tab (a PDF, a photo, a recording, plain text); every other file is saved instead. */
  opensInBrowser: boolean;
};

const format = (extension: string, contentType: string, category: GuideFileCategory, opensInBrowser = false): GuideFileFormat => ({
  extension,
  contentType,
  label: extension.toUpperCase(),
  category,
  opensInBrowser,
});

/**
 * The files a travel guide's "File to download" section takes: documents, spreadsheets, presentations, images,
 * audio and archives. The admin checks each upload's content against its ending (guideFileChecks.ts), so a renamed
 * file is refused.
 */
export const GUIDE_FILE_FORMATS: readonly GuideFileFormat[] = [
  format("pdf", "application/pdf", "pdf", true),
  format("doc", "application/msword", "document"),
  format("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "document"),
  format("txt", "text/plain", "document", true),
  format("rtf", "application/rtf", "document"),
  format("xls", "application/vnd.ms-excel", "spreadsheet"),
  format("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "spreadsheet"),
  format("csv", "text/csv", "spreadsheet"),
  format("ods", "application/vnd.oasis.opendocument.spreadsheet", "spreadsheet"),
  format("ppt", "application/vnd.ms-powerpoint", "presentation"),
  format("pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "presentation"),
  format("odp", "application/vnd.oasis.opendocument.presentation", "presentation"),
  format("jpg", "image/jpeg", "image", true),
  format("jpeg", "image/jpeg", "image", true),
  format("png", "image/png", "image", true),
  format("webp", "image/webp", "image", true),
  format("gif", "image/gif", "image", true),
  format("svg", "image/svg+xml", "image", true),
  format("mp3", "audio/mpeg", "audio", true),
  format("wav", "audio/wav", "audio", true),
  format("m4a", "audio/mp4", "audio", true),
  format("ogg", "audio/ogg", "audio", true),
  format("zip", "application/zip", "archive"),
  format("rar", "application/vnd.rar", "archive"),
  format("7z", "application/x-7z-compressed", "archive"),
];

/** For a file input's `accept`: ".pdf,.doc,…". */
export const GUIDE_FILE_ACCEPT = GUIDE_FILE_FORMATS.map((each) => `.${each.extension}`).join(",");

/** "PDF, Word, Excel…": the kinds an editor may add, in words. */
export const GUIDE_FILE_KINDS_TEXT = "PDF, Word, Excel, PowerPoint, OpenDocument, text, CSV, photos (JPG, PNG, WebP, GIF, SVG), audio (MP3, WAV, M4A, OGG) or ZIP, RAR, 7Z";

/** The format of a file name or address by its ending ("Packing List.XLSX" → xlsx), or undefined for one not taken. */
export const guideFileFormatOf = (nameOrPath: string) => {
  const extension = nameOrPath.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  return extension ? GUIDE_FILE_FORMATS.find((each) => each.extension === extension) : undefined;
};

/**
 * A travel guide's "File to download" section: a file in the public trek-files storage, at
 * guide-files/<uuid>/<name>.<ending>. The name comes from the uploaded file ("Langtang packing list.pdf" →
 * "langtang-packing-list"), so the download keeps a readable name; the id folder keeps addresses unique.
 * The admin checks the address when it saves, the website again before it links to it.
 */
export const GUIDE_FILE_PATH = new RegExp(`^guide-files\\/[0-9a-f-]{36}\\/[a-z0-9]+(-[a-z0-9]+)*\\.(${GUIDE_FILE_FORMATS.map((each) => each.extension).join("|")})$`);

/** The storage's own limit (15 MB). */
export const MAX_GUIDE_FILE_BYTES = 15 * 1024 * 1024;

/** "1.2 MB", "850 KB": a file's size for people. */
export const fileSizeLabel = (bytes: number, language: SiteLanguage = "en") => {
  if (bytes >= 1024 * 1024) {
    const megabytes = (bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "");
    return `${language === "de" ? megabytes.replace(".", ",") : megabytes} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

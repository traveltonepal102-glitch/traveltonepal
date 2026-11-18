import type { IconName } from "../icons/paths";

/** A downloadable file's kind (GuideFileCategory in @ttn/config/guideFiles) and the icon it is shown with. */
export const FILE_ICONS: Record<"pdf" | "document" | "spreadsheet" | "presentation" | "image" | "audio" | "archive", IconName> = {
  pdf: "picture_as_pdf",
  document: "description",
  spreadsheet: "table_chart",
  presentation: "slideshow",
  image: "image",
  audio: "audio_file",
  archive: "folder_zip",
};

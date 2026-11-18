/*
 * Whether an uploaded guide file really is what its ending says (its content, not its name), for every format in
 * @ttn/config/guideFiles. Pure, so it is tested; finishGuideFileUpload applies it after each upload.
 */
import type { GuideFileFormat } from "@ttn/config/guideFiles";

import { isPdfFile } from "./trekFileChecks";

const startsWith = (file: Buffer, signature: readonly number[], at = 0) =>
  file.length >= at + signature.length && signature.every((byte, index) => file[at + index] === byte);
const bytesOf = (text: string) => [...Buffer.from(text, "latin1")];

/** Old Word, Excel and PowerPoint files (.doc, .xls, .ppt): Microsoft's compound file. */
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
/** A ZIP's first entry; Office (.docx…) and OpenDocument (.ods…) files are ZIPs too. */
const ZIP = bytesOf("PK\x03\x04");
const RIFF = bytesOf("RIFF");

const isZip = (file: Buffer) => startsWith(file, ZIP);
const isOle = (file: Buffer) => startsWith(file, OLE);
/** A ZIP that holds an Office document of this part ("word/", "xl/", "ppt/"); entry names are plain text in it. */
const isOffice = (folder: string) => (file: Buffer) => isZip(file) && file.includes("[Content_Types].xml") && file.includes(folder);
/** OpenDocument puts its type, uncompressed, as the first entry ("mimetype"). */
const isOpenDocument = (contentType: string) => (file: Buffer) => isZip(file) && file.subarray(0, 200).includes(`mimetype${contentType}`);
/** Text: no NUL byte in its first 64 KB (binary files have them early). */
const isText = (file: Buffer) => file.length > 0 && !file.subarray(0, 64 * 1024).includes(0);
const isRiff = (kind: string) => (file: Buffer) => startsWith(file, RIFF) && startsWith(file, bytesOf(kind), 8);

/** An MP3 starts with its tags (ID3) or straight with an audio frame (eleven set bits). */
const isMp3 = (file: Buffer) => startsWith(file, bytesOf("ID3")) || (file.length > 1 && file[0] === 0xff && (file[1] & 0xe0) === 0xe0);

/**
 * An SVG drawing, refused when it could run anything once opened: scripts, event handlers ("onload="),
 * "javascript:" links, embedded pages or entities.
 */
const UNSAFE_SVG = /<script|<foreignObject|<!ENTITY|<iframe|<embed|<object|\bon[a-z]+\s*=|javascript:/i;
const isSafeSvg = (file: Buffer) => {
  if (!isText(file)) return false;
  const text = file.toString("utf8");
  return /<svg[\s>]/i.test(text.slice(0, 4096)) && !UNSAFE_SVG.test(text);
};

const CHECKS: Record<string, (file: Buffer) => boolean> = {
  pdf: isPdfFile,
  doc: isOle,
  xls: isOle,
  ppt: isOle,
  docx: isOffice("word/"),
  xlsx: isOffice("xl/"),
  pptx: isOffice("ppt/"),
  ods: isOpenDocument("application/vnd.oasis.opendocument.spreadsheet"),
  odp: isOpenDocument("application/vnd.oasis.opendocument.presentation"),
  txt: isText,
  csv: isText,
  rtf: (file) => startsWith(file, bytesOf("{\\rtf")),
  jpg: (file) => startsWith(file, [0xff, 0xd8, 0xff]),
  jpeg: (file) => startsWith(file, [0xff, 0xd8, 0xff]),
  png: (file) => startsWith(file, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  webp: isRiff("WEBP"),
  gif: (file) => startsWith(file, bytesOf("GIF87a")) || startsWith(file, bytesOf("GIF89a")),
  svg: isSafeSvg,
  mp3: isMp3,
  wav: isRiff("WAVE"),
  m4a: (file) => startsWith(file, bytesOf("ftyp"), 4),
  ogg: (file) => startsWith(file, bytesOf("OggS")),
  zip: isZip,
  rar: (file) => startsWith(file, bytesOf("Rar!\x1a\x07")),
  "7z": (file) => startsWith(file, [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]),
};

/** Whether these bytes are a file of this format (false for a format with no check, so a new one must add its own). */
export const isGuideFileOf = (format: GuideFileFormat, file: Buffer) => CHECKS[format.extension]?.(file) ?? false;

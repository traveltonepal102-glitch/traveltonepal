import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_BYTES } from "../constants";
import { formatFileSize } from "./formatFileSize";

/** File types people often try, with what to do instead. */
const KNOWN_TYPES: Record<string, string> = {
  heic: "HEIC photos (the iPhone's format) can't be used. Save it as a JPEG and add it again.",
  heif: "HEIF photos (the iPhone's format) can't be used. Save it as a JPEG and add it again.",
  gif: "GIF files can't be used. Use a JPEG, PNG or WebP photo.",
  svg: "SVG drawings can't be used. Use a JPEG, PNG or WebP photo.",
  avif: "AVIF photos can't be used yet. Save it as a JPEG or WebP and add it again.",
  tif: "TIFF files can't be used. Save it as a JPEG and add it again.",
  tiff: "TIFF files can't be used. Save it as a JPEG and add it again.",
  pdf: "PDF files can't be used here. Use a JPEG, PNG or WebP photo.",
};

const extensionOf = (fileName: string) => fileName.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? "";

/** What's wrong with a file before it is sent (the server checks the real file again), or undefined when it can go. */
export const checkPhotoFile = ({ name, type, size }: { name: string; type: string; size: number }) => {
  if (!ACCEPTED_PHOTO_TYPES.includes(type)) {
    return KNOWN_TYPES[extensionOf(name)] ?? "This file type can't be used. Use a JPEG, PNG or WebP photo.";
  }
  if (size === 0) return "This file is empty. Choose the photo again.";
  if (size > MAX_PHOTO_BYTES) {
    return `This photo is ${formatFileSize(size)}; photos can be up to ${formatFileSize(MAX_PHOTO_BYTES)}. Save a smaller copy and add it again.`;
  }
  return undefined;
};

/** S3's error code (<Code>…</Code>) or Supabase Storage's ("error" in its JSON), if the answer has one. */
const errorCode = (body: string) => {
  const s3Code = body.match(/<Code>([^<]+)<\/Code>/)?.[1];
  if (s3Code) return s3Code;
  try {
    const json: unknown = JSON.parse(body);
    return json && typeof json === "object" && "error" in json && typeof json.error === "string" ? json.error : "";
  } catch {
    return "";
  }
};

/**
 * Why the photo storage refused a file sent to its upload link (S3 or Supabase Storage), in words an editor can act on.
 * `status` 0 means no answer at all: the connection, or the storage's CORS rules not listing this admin address.
 */
export const storageUploadErrorMessage = (status: number, body: string) => {
  if (status === 0) {
    return "The photo storage couldn't be reached. Check your internet connection and try again. If your connection is fine, the storage doesn't accept uploads from this admin address yet (its CORS rules).";
  }
  const code = errorCode(body);
  if (code === "RequestTimeTooSkewed") return "Your computer's clock is wrong, so the storage refused the photo. Set the date and time to automatic and try again.";
  if (status === 413 || code === "EntityTooLarge") return "This photo is too large for the storage. Save a smaller copy and add it again.";
  if (status === 403 || status === 401 || code === "SignatureDoesNotMatch") {
    return "The storage refused the upload link (it may have expired). Add the photo again.";
  }
  if (status >= 500 || code === "SlowDown") return "The photo storage has a problem right now. Try again in a minute.";
  return `The storage refused the photo (${[status, code].filter(Boolean).join(" ")}). Add it again; if it keeps happening, tell your developer.`;
};

import { Node, ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";

import type { Photo } from "@/features/photos/types";

import { LibraryImageView } from "./LibraryImageView";

/** A photo attribute kept as data-* on the <img>, so a photo cut and pasted inside the editor keeps it. */
const dataAttribute = <Value>(key: string, name: string, fallback: Value, parse: (text: string) => Value) => ({
  default: fallback,
  parseHTML: (element: HTMLElement) => {
    const text = element.getAttribute(`data-${name}`);
    if (text === null) return fallback;
    try {
      return parse(text);
    } catch {
      return fallback;
    }
  },
  renderHTML: (attributes: Record<string, unknown>) => ({ [`data-${name}`]: JSON.stringify(attributes[key]) }),
});

/**
 * "image": a photo from the photo library inside the text (the shared format's RichTextImage). Only photos picked from
 * the library are images here: an <img> pasted from another site has no data-photo-id and is dropped.
 */
export const LibraryImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      photoId: dataAttribute<string>("photoId", "photo-id", "", (text) => String(JSON.parse(text))),
      alt: { default: "", parseHTML: (element: HTMLElement) => element.getAttribute("alt") ?? "", renderHTML: (attributes: Record<string, unknown>) => ({ alt: attributes.alt }) },
      width: dataAttribute<number>("width", "width", 0, (text) => Number(JSON.parse(text))),
      height: dataAttribute<number>("height", "height", 0, (text) => Number(JSON.parse(text))),
      variantWidths: dataAttribute<number[]>("variantWidths", "variant-widths", [], (text) => JSON.parse(text)),
    };
  },
  parseHTML() {
    return [{ tag: "img[data-photo-id]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(LibraryImageView);
  },
});

/** A library photo as the image to insert; its place is the first description. */
export const libraryImageContent = (photo: Photo) => ({
  type: "image",
  attrs: { photoId: photo.id, alt: photo.place, width: photo.width, height: photo.height, variantWidths: photo.variantWidths },
});

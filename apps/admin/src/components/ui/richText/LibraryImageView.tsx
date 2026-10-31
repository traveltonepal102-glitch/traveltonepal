"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { usePhotosBaseUrl } from "./PhotosBaseUrl";

/** A photo inside the text, as the editor shows it: the photo, its description (required) and Remove. */
export const LibraryImageView = ({ node, updateAttributes, deleteNode, selected }: NodeViewProps) => {
  const baseUrl = usePhotosBaseUrl();
  const { photoId, alt, width, height, variantWidths, fileName } = node.attrs as {
    photoId: string;
    alt: string;
    width: number;
    height: number;
    variantWidths: number[];
    fileName: string | null;
  };
  const photo = { id: photoId, width, height, baseUrl: `${baseUrl}/${photoId}`, variantWidths, fileName, placeholder: "", place: "" };

  return (
    <NodeViewWrapper as="figure" contentEditable={false} data-drag-handle className={cn("my-3 flex flex-col gap-1.5 rounded-lg border border-solid p-2", selected ? "border-brand ring-3 ring-brand/15" : "border-border")}>
      <div className="relative overflow-hidden rounded-md bg-page">
        <PhotoImage photo={photo} alt={alt} sizes="640px" className="block h-auto max-h-80 w-full object-contain" />
        <button type="button" aria-label="Remove this photo" title="Remove this photo" onClick={() => deleteNode()} className={cn(ghostIconButton, "absolute top-2 right-2 bg-surface")}>
          <Icon name="delete" size={18} />
        </button>
      </div>
      <input
        type="text"
        value={alt}
        maxLength={250}
        aria-label="Describe the photo"
        placeholder="Describe the photo (what it shows), for Google and screen readers"
        onChange={(event) => updateAttributes({ alt: event.target.value })}
        className={cn("m-0 h-9 rounded-sm border border-solid px-2.5 font-sans text-caption text-ink outline-none focus:border-brand", alt.trim() ? "border-border" : "border-saffron-line bg-saffron-tint")}
      />
    </NodeViewWrapper>
  );
};

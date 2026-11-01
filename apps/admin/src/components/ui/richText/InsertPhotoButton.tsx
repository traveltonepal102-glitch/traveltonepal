"use client";

import type { Editor } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";

import { libraryImageContent } from "./libraryImageNode";
import { toolbarButtonClass } from "./richTextStyles";

/** "Add a photo" in a text editor's toolbar: the photo library opens (choose or upload), the photo goes in at the cursor. */
export const InsertPhotoButton = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" aria-label="Add a photo" title="Add a photo from the photo library" onClick={() => setIsOpen(true)} className={toolbarButtonClass}>
        <Icon name="add_photo_alternate" />
      </button>
      {isOpen && (
        <LibraryPhotoDialog
          title="Add a photo to the text"
          selected={[]}
          pick={{ kind: "one", onChoose: (photo) => editor.chain().focus().insertContent(libraryImageContent(photo)).run() }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

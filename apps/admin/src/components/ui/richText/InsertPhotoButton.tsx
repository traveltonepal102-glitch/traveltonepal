"use client";

import type { Editor } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";
import { usePickerPhotos } from "@/features/photos/hooks/usePickerPhotos";

import { libraryImageContent } from "./libraryImageNode";
import { toolbarButtonClass } from "./richTextStyles";

/** "Add a photo" in a text editor's toolbar: the photo library opens (choose or upload), the photo goes in at the cursor. */
export const InsertPhotoButton = ({ editor }: { editor: Editor }) => {
  const { photos, loadError, load } = usePickerPhotos();
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    load();
  };

  return (
    <>
      <button type="button" aria-label="Add a photo" title="Add a photo from the photo library" onClick={open} className={toolbarButtonClass}>
        <Icon name="add_photo_alternate" />
      </button>
      {isOpen && (
        <LibraryPhotoDialog
          title="Add a photo to the text"
          photos={photos}
          loadError={loadError}
          selectedId={null}
          onChoose={(photo) => editor.chain().focus().insertContent(libraryImageContent(photo)).run()}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
